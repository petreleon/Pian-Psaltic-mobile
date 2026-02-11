import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { generateKeyboardMap } from '../constants';
import { NoteDefinition } from '../types';

interface VerticalPianoProps {
    glasId: number;
    baseFreq: number;
    webViewRef: any;
}

const VerticalPiano: React.FC<VerticalPianoProps> = ({ glasId, baseFreq, webViewRef }) => {
    const keys = useMemo(() => generateKeyboardMap(glasId), [glasId]);

    const playNote = (note: NoteDefinition, index: number) => {
        const frequency = baseFreq * Math.pow(2, note.centsFromBase / 1200);
        if (webViewRef?.current) {
            // Send message to webview
            const script = `window.playTone(${frequency}, ${index}, 'triangle');`;
            webViewRef.current.injectJavaScript(script);
        }
    };

    const stopNote = (index: number) => {
        if (webViewRef?.current) {
            const script = `window.stopTone(${index});`;
            webViewRef.current.injectJavaScript(script);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* Reverse map to list notes from high (top) to low (bottom) naturally? 
          Or maybe low to high? Vertical pianos often go low->bottom high->top?
          Let's stick to list order top-down being low-to-high or high-to-low.
          Usually vertical scroll means top is... well, list starts at top.
          Let's render them in order (Low to High), so top of screen is Low notes. 
          Actually, visually "up" usually means higher pitch.
          So we might want to reverse the array so Higher Pitch notes are at the TOP of the scroll view?
          Let's try Low at Top for now, it's easier to list.
      */}
            {keys.map((note, index) => {
                const isSharp = false; // Psaltic doesn't have black keys in same way, but we have "isTonic"

                return (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.7}
                        onPressIn={() => playNote(note, index)}
                        onPressOut={() => stopNote(index)}
                        style={[
                            styles.key,
                            note.isTonic && note.octaveOffset === 0 ? styles.keyTonicMain :
                                note.isTonic ? styles.keyTonic : styles.keyNormal
                        ]}
                    >
                        <View style={styles.labelContainer}>
                            <Text style={[
                                styles.noteName,
                                (note.isTonic) ? styles.textLight : styles.textDark
                            ]}>
                                {note.label}
                                {note.octaveOffset > 0 ? "'" : (note.octaveOffset < 0 ? "," : "")}
                            </Text>
                            <Text style={styles.centsText}>
                                {Math.round(note.centsFromBase)}¢
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1917', // stone-900
    },
    content: {
        padding: 10,
        gap: 8,
    },
    key: {
        height: 60,
        borderRadius: 8,
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#000',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    keyNormal: {
        backgroundColor: '#e7e5e4', // stone-200
        borderColor: '#a8a29e',
    },
    keyTonic: {
        backgroundColor: '#fca5a5', // red-300
        borderColor: '#b91c1c',
    },
    keyTonicMain: {
        backgroundColor: '#991b1b', // red-800
        borderColor: '#7f1d1d',
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    noteName: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'System', // Or custom font if added
    },
    centsText: {
        fontSize: 12,
        opacity: 0.6,
    },
    textDark: {
        color: '#1c1917',
    },
    textLight: {
        color: '#fff',
    },
});

export default VerticalPiano;
