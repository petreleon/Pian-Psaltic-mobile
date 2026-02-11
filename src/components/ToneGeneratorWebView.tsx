import React, { useRef, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { View } from 'react-native';

interface ToneGeneratorProps {
  onRef: (ref: any) => void;
}

const ToneGeneratorWebView: React.FC<ToneGeneratorProps> = ({ onRef }) => {
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    if (onRef) {
      onRef(webViewRef.current);
    }
  }, [onRef]);

  const htmlContent = `
    <html>
      <body>
        <script>
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const oscillators = new Map();
          const gainNodes = new Map();
          const masterGain = ctx.createGain();
          masterGain.gain.value = 1.0;
          masterGain.connect(ctx.destination);

          window.playTone = (frequency, id, waveform = 'triangle') => {
            if (ctx.state === 'suspended') ctx.resume();
            
            // Stop existing
            if (oscillators.has(id)) {
               const oldOsc = oscillators.get(id);
               const oldGain = gainNodes.get(id);
               try {
                 oldGain.gain.cancelScheduledValues(ctx.currentTime);
                 oldGain.gain.setValueAtTime(oldGain.gain.value, ctx.currentTime);
                 oldGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
                 oldOsc.stop(ctx.currentTime + 0.1);
               } catch(e){}
               oscillators.delete(id);
               gainNodes.delete(id);
            }

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = waveform;
            osc.frequency.setValueAtTime(frequency, ctx.currentTime);
            
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.05);
            
            osc.connect(gain);
            gain.connect(masterGain);
            
            osc.start();
            
            oscillators.set(id, osc);
            gainNodes.set(id, gain);
          };

          window.stopTone = (id) => {
            if (oscillators.has(id)) {
              const osc = oscillators.get(id);
              const gain = gainNodes.get(id);
              
              const now = ctx.currentTime;
              gain.gain.cancelScheduledValues(now);
              gain.gain.setValueAtTime(gain.gain.value, now);
              gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
              osc.stop(now + 0.15);
              
              setTimeout(() => {
                // cleanup
              }, 200);
              
              oscillators.delete(id);
              gainNodes.delete(id);
            }
          };

          window.setVolume = (vol) => {
            masterGain.gain.setTargetAtTime(vol, ctx.currentTime, 0.1);
          };

          // Message handler from React Native
          document.addEventListener('message', (event) => {
            try {
              const data = JSON.parse(event.data);
              if (data.type === 'play') {
                window.playTone(data.frequency, data.id, 'triangle');
              } else if (data.type === 'stop') {
                window.stopTone(data.id);
              } else if (data.type === 'volume') {
                window.setVolume(data.volume);
              }
            } catch (e) {}
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ height: 0, opacity: 0 }}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        javaScriptEnabled={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};

export default ToneGeneratorWebView;
