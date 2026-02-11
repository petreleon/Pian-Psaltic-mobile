import React, { useImperativeHandle } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

interface ToneGeneratorProps {
    onRef: (ref: any) => void;
    onReady?: () => void;
}

const ToneGenerator: React.FC<ToneGeneratorProps> = ({ onRef, onReady }) => {

    // The HTML content with the Audio Engine
    const htmlContent = `
    <html>
    <body>
    <script>
        // --- Web Audio Engine ---
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();

        // 1. Melody Engine (Monophonic Synth)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        // Initial setup
        osc.type = 'triangle'; // Smooth but clear
        gain.gain.value = 0;   // Start silent
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(); // Keep running, gate with Gain

        // 2. Metronome Engine (Simple Click)
        // We use a short buffer or oscillator burst
        
        window.playTone = (frequency, id, waveform = 'triangle') => {
            // Resume context if suspended (browser requirement)
            if (ctx.state === 'suspended') ctx.resume();

            const isMetronome = String(id) === 'metronome';

            if (isMetronome) {
                // Click Sound
                const mOsc = ctx.createOscillator();
                const mGain = ctx.createGain();
                mOsc.type = 'square';
                mOsc.frequency.value = frequency;
                
                mGain.gain.setValueAtTime(0.5, ctx.currentTime);
                mGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
                
                mOsc.connect(mGain);
                mGain.connect(ctx.destination);
                
                mOsc.start();
                mOsc.stop(ctx.currentTime + 0.1);
            } else {
                // Melody Note
                const now = ctx.currentTime;
                
                // Set Frequency Instantaneously or with slight portamento
                // osc.frequency.value = frequency; 
                osc.frequency.setTargetAtTime(frequency, now, 0.005); // 5ms slide (nearly instant but click-free)

                // Envelope Attack
                // If already playing, we just change pitch (Legato).
                // If silent, we attack.
                // We enforce volume 1.
                gain.gain.cancelScheduledValues(now);
                gain.gain.setTargetAtTime(1.0, now, 0.01); // Fast attack
            }
        };

        window.stopTone = (id) => {
             const isMetronome = String(id) === 'metronome';
             if (isMetronome) return; // Auto-stops

             // Stop Melody
             // With Monophony, we only stop if the user lifted the finger.
             // But if they slid to another key, the 'playTone' for the new key 
             // might have happened BEFORE this stopTone (depending on React events).
             // However, strictly speaking, stopTone should set volume to 0.
             
             // Simple Release
             const now = ctx.currentTime;
             gain.gain.cancelScheduledValues(now);
             gain.gain.setTargetAtTime(0, now, 0.05); // Fast release
        };

        window.setVolume = (vol) => {
            // We can add a master gain if needed, but for now ignore.
        };

        // Notify Native that we are ready (optional)
        // window.ReactNativeWebView.postMessage("READY");
    </script>
    </body>
    </html>
    `;

    return (
        <View style={{ width: 0, height: 0, overflow: 'hidden' }}>
            <WebView
                originWhitelist={['*']}
                useWebKit={true}
                source={{ html: htmlContent }}
                javaScriptEnabled={true}
                mediaPlaybackRequiresUserAction={false} // Crucial for auto-play
                ref={(ref) => {
                    if (ref && onRef) {
                        onRef({
                            playTone: (freq: number, id: string | number) => {
                                const script = `window.playTone(${freq}, "${id}");`;
                                ref.injectJavaScript(script);
                            },
                            stopTone: (id: string | number) => {
                                const script = `window.stopTone("${id}");`;
                                ref.injectJavaScript(script);
                            },
                            setVolume: (vol: number) => {
                                // optional
                            },
                            // Legacy compatibility if App checks playTone presence
                            injectJavaScript: (s: string) => ref.injectJavaScript(s)
                        });
                    }
                }}
                onLoadEnd={() => {
                    if (onReady) onReady();
                }}
            />
        </View>
    );
};

export default ToneGenerator;
