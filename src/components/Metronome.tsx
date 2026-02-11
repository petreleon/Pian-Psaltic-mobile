import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Square, Plus, Minus, ArrowUp, ArrowDown } from 'lucide-react-native';

interface MetronomeProps {
    webViewRef: any;
    octave: number;
    setOctave: (o: number) => void;
}

const Metronome: React.FC<MetronomeProps> = ({ webViewRef, octave, setOctave }) => {
    const [bpm, setBpm] = useState(60);
    const [isPlaying, setIsPlaying] = useState(false);
    const [beat, setBeat] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isPlaying) {
            const interval = 60000 / bpm;
            timerRef.current = setInterval(() => {
                setBeat(prev => (prev + 1) % 4);
                // Play click sound via WebView engine for consistency
                // High pitch short beep
                if (webViewRef?.current) {
                    const script = `
             window.playTone(880, 9999, 'square');
             setTimeout(() => window.stopTone(9999), 50);
           `;
                    webViewRef.current.injectJavaScript(script);
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
            <Text style={styles.title}>Metronome</Text>

            <View style={styles.bpmContainer}>
                <TouchableOpacity onPress={() => setBpm(b => Math.max(30, b - 5))} style={styles.btnSmall}>
                    <Minus size={20} color="#ccc" />
                </TouchableOpacity>
                <Text style={styles.bpmText}>{bpm} BPM</Text>
                <TouchableOpacity onPress={() => setBpm(b => Math.min(240, b + 5))} style={styles.btnSmall}>
                    <Plus size={20} color="#ccc" />
                </TouchableOpacity>
            </View>

            <View style={styles.visualizer}>
                {[0, 1, 2, 3].map(i => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            { backgroundColor: isPlaying && beat === i ? '#ef4444' : '#444' }
                        ]}
                    />
                ))}
            </View>

            {/* Octave Control */}
            <View style={styles.octaveContainer}>
                <Text style={styles.subTitle}>OCTAVA</Text>
                <View style={styles.octaveControls}>
                    <TouchableOpacity onPress={() => setOctave(octave - 1)} style={[styles.btnSmall, octave <= -2 && styles.btnDisabled]} disabled={octave <= -2}>
                        <ArrowDown size={20} color={octave <= -2 ? "#666" : "#ccc"} />
                    </TouchableOpacity>
                    <Text style={styles.octaveText}>{octave > 0 ? `+${octave}` : octave}</Text>
                    <TouchableOpacity onPress={() => setOctave(octave + 1)} style={[styles.btnSmall, octave >= 2 && styles.btnDisabled]} disabled={octave >= 2}>
                        <ArrowUp size={20} color={octave >= 2 ? "#666" : "#ccc"} />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.playBtn, isPlaying ? styles.stopBtn : styles.startBtn]}
                onPress={() => setIsPlaying(!isPlaying)}
            >
                {isPlaying ? <Square size={24} color="#fff" /> : <Play size={24} color="#fff" />}
                <Text style={styles.btnText}>{isPlaying ? 'STOP' : 'START'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#292524', // stone-800
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderColor: '#444',
    },
    title: {
        color: '#fbbf24', // amber-400
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 20,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    bpmContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        gap: 8,
    },
    bpmText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
        width: 60,
        textAlign: 'center',
    },
    btnSmall: {
        padding: 8,
        backgroundColor: '#444',
        borderRadius: 8,
    },
    visualizer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 40,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    playBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 6,
    },
    startBtn: {
        backgroundColor: '#166534', // green-700
    },
    stopBtn: {
        backgroundColor: '#991b1b', // red-800
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    octaveContainer: {
        alignItems: 'center',
        marginBottom: 30,
        width: '100%'
    },
    subTitle: {
        color: '#a8a29e',
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 1
    },
    octaveControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: '#1c1917',
        padding: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#444'
    },
    octaveText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        width: 30,
        textAlign: 'center'
    },
    btnDisabled: {
        opacity: 0.5
    }
});

export default Metronome;
