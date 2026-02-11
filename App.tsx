import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';
import ToneGeneratorWebView from './src/components/ToneGeneratorWebView';
import VerticalPiano from './src/components/VerticalPiano';
import Metronome from './src/components/Metronome';
import ControlPanel from './src/components/ControlPanel';
import { GLASURI, BASE_NOTE_FREQUENCIES } from './src/constants';

export default function App() {
    const [currentGlas, setCurrentGlas] = useState<number>(1);
    const [baseFreq, setBaseFreq] = useState<number>(293.66); // Pa default
    const [octave, setOctave] = useState<number>(0); // -1, 0, 1
    const webViewRef = useRef<any>(null);

    useEffect(() => {
        async function configureAudio() {
            try {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                });
            } catch (e) {
                console.error("Audio configuration failed", e);
            }
        }
        configureAudio();
    }, []);

    // Update Base Frequency when Glas changes
    useEffect(() => {
        const selectedGlas = GLASURI.find(g => g.id === currentGlas);
        if (selectedGlas && BASE_NOTE_FREQUENCIES[selectedGlas.baseNote]) {
            setBaseFreq(BASE_NOTE_FREQUENCIES[selectedGlas.baseNote]);
        }
    }, [currentGlas]);

    // Effective frequency calculation happens in VerticalPiano now, 
    // but we need to pass the octave there.
    // Actually, VerticalPiano needs baseFreq * 2^octave.

    const effectiveBaseFreq = baseFreq * Math.pow(2, octave);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            {/* Hidden Audio Engine */}
            <ToneGeneratorWebView onRef={(ref) => (webViewRef.current = ref)} />

            {/* Top Control Panel */}
            <ControlPanel
                currentGlasId={currentGlas}
                setGlasId={setCurrentGlas}
                baseFreq={baseFreq}
                setBaseFreq={setBaseFreq}
            />

            <View style={styles.mainContent}>
                {/* Left: Piano */}
                <View style={styles.pianoSection}>
                    <VerticalPiano
                        glasId={currentGlas}
                        baseFreq={effectiveBaseFreq}
                        webViewRef={webViewRef}
                    />
                </View>

                {/* Right: Metronome + Octave Control */}
                <View style={styles.metronomeSection}>
                    <Metronome
                        webViewRef={webViewRef}
                        octave={octave}
                        setOctave={setOctave}
                    />
                </View>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1917', // stone-950
    },
    mainContent: {
        flex: 1,
        flexDirection: 'row',
    },
    pianoSection: {
        flex: 0.6, // 60% width
        borderRightWidth: 1,
        borderColor: '#444',
    },
    metronomeSection: {
        flex: 0.4, // 40% width
    },
});
