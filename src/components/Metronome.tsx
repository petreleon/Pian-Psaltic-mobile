import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Square, Settings } from 'lucide-react-native';

interface MetronomeProps {
    webViewRef: any;
    bpm: number;
    octave: number;
    onOpenSettings: () => void;
}

const Metronome: React.FC<MetronomeProps> = ({ webViewRef, bpm, octave, onOpenSettings }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [beat, setBeat] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isPlaying) {
            const interval = 60000 / bpm;
            timerRef.current = setInterval(() => {
                setBeat(prev => (prev + 1) % 4);
                // Play click sound via ToneGenerator
                if (webViewRef?.current?.playTone) {
                    webViewRef.current.playTone(880, 'metronome');
                    setTimeout(() => {
                        if (webViewRef?.current?.stopTone) {
                            webViewRef.current.stopTone('metronome');
                        }
                    }, 50);
                }
            }, interval);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            setBeat(0);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, bpm, webViewRef]);

    return (
        <View style={styles.container}>
            {/* Main Display: BPM Readout + Octave */}
            <View style={styles.mainDisplay}>
                <Text style={styles.bpmLarge}>{bpm} <Text style={styles.bpmLabel}>BPM</Text></Text>
                <Text style={styles.octaveLabel}>Octava: {octave > 0 ? `+${octave}` : octave}</Text>
            </View>

            {/* Action Buttons Column */}
            <View style={styles.actionColumn}>
                <TouchableOpacity
                    style={[styles.playBtn, isPlaying ? styles.stopBtn : styles.startBtn]}
                    onPress={() => setIsPlaying(!isPlaying)}
                >
                    {isPlaying ? <Square size={24} color="#fff" /> : <Play size={24} color="#fff" />}
                    <Text style={styles.btnText}>{isPlaying ? 'STOP' : 'START'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.settingsBtn}
                    onPress={onOpenSettings}
                >
                    <Settings size={20} color="#78716c" />
                    <Text style={styles.settingsBtnText}>MODIFICĂ</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1917',
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderColor: '#292524',
    },
    mainDisplay: {
        alignItems: 'center',
        marginBottom: 40, // Increased spacing
        justifyContent: 'center',
        flex: 1
    },
    bpmLarge: {
        color: '#fff',
        fontSize: 48, // Larger
        fontWeight: '900',
        fontVariant: ['tabular-nums'],
    },
    bpmLabel: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#78716c'
    },
    octaveLabel: {
        marginTop: 8,
        color: '#a8a29e',
        fontSize: 16,
        fontWeight: '600'
    },
    actionColumn: {
        flexDirection: 'column',
        gap: 16, // Spacing between buttons
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 20
    },
    playBtn: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4
    },
    settingsBtn: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: 'transparent', // Transparent minimal look
        gap: 8
    },
    startBtn: {
        backgroundColor: '#15803d', // green-700
    },
    stopBtn: {
        backgroundColor: '#b91c1c', // red-700
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1
    },
    settingsBtnText: {
        color: '#78716c', // Subtle text
        fontWeight: '600',
        fontSize: 14,
    },
});

export default Metronome;
