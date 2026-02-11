import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
// import * as SplashScreen from 'expo-splash-screen'; // Not blocking anymore
import ToneGenerator from './src/components/ToneGenerator';
import VerticalPiano from './src/components/VerticalPiano';
import Metronome from './src/components/Metronome';
import SettingsPage from './src/components/SettingsPage';
import { GLASURI, BASE_NOTE_FREQUENCIES } from './src/constants';

// SplashScreen.preventAutoHideAsync(); // Disabled

export default function App() {
    const [currentGlas, setCurrentGlas] = useState<number>(1);
    const [baseFreq, setBaseFreq] = useState<number>(293.66); // Pa default
    const [octave, setOctave] = useState<number>(0); // -1, 0, 1
    const [bpm, setBpm] = useState<number>(60);
    const [showSettings, setShowSettings] = useState(false);

    // We don't need appIsReady state for splash screen blocking anymore
    // using Web Audio is instant.

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

    const effectiveBaseFreq = baseFreq * Math.pow(2, octave);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
                <StatusBar style="light" />

                {/* Audio Engine (Web Audio) */}
                <ToneGenerator onRef={(ref) => (webViewRef.current = ref)} />

                {showSettings ? (
                    <SettingsPage
                        onClose={() => setShowSettings(false)}
                        currentGlasId={currentGlas}
                        setGlasId={setCurrentGlas}
                        baseFreq={baseFreq}
                        setBaseFreq={setBaseFreq}
                        bpm={bpm}
                        setBpm={setBpm}
                        octave={octave}
                        setOctave={setOctave}
                    />
                ) : (
                    <View style={styles.mainContent}>
                        {/* Left: Piano */}
                        <View style={styles.pianoSection}>
                            <VerticalPiano
                                glasId={currentGlas}
                                baseFreq={effectiveBaseFreq}
                                webViewRef={webViewRef}
                            />
                        </View>

                        {/* Right: Metronome (Performance View) */}
                        <View style={styles.metronomeSection}>
                            <Metronome
                                webViewRef={webViewRef}
                                bpm={bpm}
                                octave={octave}
                                onOpenSettings={() => setShowSettings(true)}
                            />
                        </View>
                    </View>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
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
