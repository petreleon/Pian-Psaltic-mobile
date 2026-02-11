import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { GLASURI } from '../constants';

interface ControlPanelProps {
    currentGlasId: number;
    setGlasId: (id: number) => void;
    baseFreq: number;
    setBaseFreq: (freq: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
    currentGlasId,
    setGlasId,
    baseFreq,
    setBaseFreq
}) => {
    const FREQ_PRESETS = [
        { label: 'Ni (Do)', val: 261.63 },
        { label: 'Pa (Re)', val: 293.66 },
        { label: 'Vu (Mi)', val: 329.63 },
        { label: 'Ga (Fa)', val: 349.23 },
        { label: 'Di (Sol)', val: 392.00 },
        { label: 'Ke (La)', val: 440.00 },
        { label: 'Zo (Si)', val: 493.88 },
    ];

    const currentGlas = GLASURI.find(g => g.id === currentGlasId);

    return (
        <View style={styles.container}>
            {/* Top Bar for Base Freq */}
            <View style={styles.topBar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.freqScroll}>
                    {FREQ_PRESETS.map(p => (
                        <TouchableOpacity
                            key={p.val}
                            onPress={() => setBaseFreq(p.val)}
                            style={[styles.freqBtn, baseFreq === p.val && styles.freqBtnActive]}
                        >
                            <Text style={[styles.freqText, baseFreq === p.val && styles.textActive]}>{p.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Glas Selection */}
            <View style={styles.glasContainer}>
                <Text style={styles.sectionTitle}>Glas:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.glasScroll}>
                    {GLASURI.map(g => (
                        <TouchableOpacity
                            key={g.id}
                            onPress={() => setGlasId(g.id)}
                            style={[styles.glasBtn, currentGlasId === g.id && styles.glasBtnActive]}
                        >
                            <Text style={[styles.glasText, currentGlasId === g.id && styles.textActive]}>{g.id}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <Text style={styles.glasDesc}>{currentGlas?.name}: {currentGlas?.description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#292524', // stone-800
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#444',
    },
    topBar: {
        marginBottom: 8,
    },
    freqScroll: {
        flexDirection: 'row',
        gap: 8,
        paddingRight: 20
    },
    freqBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#444',
        borderRadius: 6,
    },
    freqBtnActive: {
        backgroundColor: '#b45309', // amber-600
    },
    freqText: {
        color: '#ccc',
        fontSize: 12,
        fontWeight: '600'
    },
    glasContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 4
    },
    sectionTitle: {
        color: '#fbbf24',
        fontWeight: 'bold',
        fontSize: 14,
    },
    glasScroll: {
        flexDirection: 'row',
        gap: 6,
    },
    glasBtn: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#444',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#555'
    },
    glasBtnActive: {
        backgroundColor: '#991b1b', // red-800
        borderColor: '#ef4444',
    },
    glasText: {
        color: '#ccc',
        fontWeight: 'bold',
        fontSize: 16
    },
    textActive: {
        color: '#fff',
    },
    glasDesc: {
        color: '#a8a29e', // stone-400
        fontSize: 10,
        fontStyle: 'italic',
        marginTop: 2
    }
});

export default ControlPanel;
