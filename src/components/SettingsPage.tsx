
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { ArrowLeft, Minus, Plus, ArrowDown, ArrowUp } from 'lucide-react-native';
import { GLASURI } from '../constants';

interface SettingsPageProps {
    onClose: () => void;
    currentGlasId: number;
    setGlasId: (id: number) => void;
    baseFreq: number;
    setBaseFreq: (freq: number) => void;
    bpm: number;
    setBpm: (bpm: number | ((prev: number) => number)) => void;
    octave: number;
    setOctave: (o: number) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
    onClose,
    currentGlasId,
    setGlasId,
    baseFreq,
    setBaseFreq,
    bpm,
    setBpm,
    octave,
    setOctave
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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.backBtn}>
                    <ArrowLeft size={24} color="#fff" />
                    <Text style={styles.backText}>Înapoi</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Setări</Text>
                <View style={{ width: 80 }} />
            </View>

            <ScrollView style={styles.content}>

                {/* Section: Glas & Base Note */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>GLAS & NOTA DE BAZĂ</Text>

                    <Text style={styles.label}>Alege Glasul:</Text>
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
                    <Text style={styles.glasDesc}>{currentGlas?.name}</Text>

                    <Text style={styles.label}>Nota de Referință:</Text>
                    <View style={styles.freqGrid}>
                        {FREQ_PRESETS.map(p => (
                            <TouchableOpacity
                                key={p.val}
                                onPress={() => setBaseFreq(p.val)}
                                style={[styles.freqBtn, baseFreq === p.val && styles.freqBtnActive]}
                            >
                                <Text style={[styles.freqText, baseFreq === p.val && styles.textActive]}>{p.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Section: Metronome Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>METRONOM</Text>

                    <Text style={styles.label}>Tempo (BPM):</Text>
                    <View style={styles.controlRow}>
                        <TouchableOpacity onPress={() => setBpm(b => Math.max(30, b - 5))} style={styles.controlBtn}>
                            <Minus size={24} color="#ccc" />
                        </TouchableOpacity>
                        <Text style={styles.valueText}>{bpm}</Text>
                        <TouchableOpacity onPress={() => setBpm(b => Math.min(240, b + 5))} style={styles.controlBtn}>
                            <Plus size={24} color="#ccc" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Octava:</Text>
                    <View style={styles.controlRow}>
                        <TouchableOpacity onPress={() => setOctave(octave - 1)} style={[styles.controlBtn, octave <= -2 && styles.btnDisabled]} disabled={octave <= -2}>
                            <ArrowDown size={24} color={octave <= -2 ? "#666" : "#ccc"} />
                        </TouchableOpacity>
                        <Text style={styles.valueText}>{octave > 0 ? `+${octave}` : octave}</Text>
                        <TouchableOpacity onPress={() => setOctave(octave + 1)} style={[styles.controlBtn, octave >= 2 && styles.btnDisabled]} disabled={octave >= 2}>
                            <ArrowUp size={24} color={octave >= 2 ? "#666" : "#ccc"} />
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1917', // stone-950
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#292524',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        width: 80
    },
    backText: {
        color: '#fff',
        fontSize: 16,
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 32,
        backgroundColor: '#292524',
        padding: 20,
        borderRadius: 16,
    },
    sectionTitle: {
        color: '#fbbf24', // amber-400
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 20,
        letterSpacing: 1,
        opacity: 0.8
    },
    label: {
        color: '#a8a29e',
        marginBottom: 12,
        fontSize: 14,
        fontWeight: '600'
    },
    glasScroll: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8
    },
    glasBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#444',
        borderRadius: 22,
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
        fontSize: 18
    },
    textActive: {
        color: '#fff',
    },
    glasDesc: {
        color: '#78716c',
        fontSize: 13,
        fontStyle: 'italic',
        marginBottom: 24,
    },
    freqGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    freqBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#444',
        borderRadius: 8,
        flexGrow: 1,
        alignItems: 'center'
    },
    freqBtnActive: {
        backgroundColor: '#b45309', // amber-600
    },
    freqText: {
        color: '#ccc',
        fontSize: 13,
        fontWeight: '600'
    },
    controlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: '#1c1917',
        padding: 8,
        borderRadius: 12
    },
    controlBtn: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#44403c',
        borderRadius: 12,
    },
    valueText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        width: 80,
        textAlign: 'center'
    },
    btnDisabled: {
        opacity: 0.3
    }
});

export default SettingsPage;
