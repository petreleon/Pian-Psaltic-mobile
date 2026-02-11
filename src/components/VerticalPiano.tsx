import React, { useMemo, useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, Easing } from 'react-native';
import { generateKeyboardMap } from '../constants';
import { NoteDefinition } from '../types';

interface VerticalPianoProps {
    glasId: number;
    baseFreq: number;
    webViewRef: any;
}

interface PianoKeyProps {
    note: NoteDefinition;
    index: number;
    isActive: boolean;
    onPlay: () => void;
    onStop: () => void;
}

const PianoKey: React.FC<PianoKeyProps> = ({ note, isActive, onPlay, onStop }) => {
    const animVal = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animVal, {
            toValue: isActive ? 1 : 0,
            duration: 150, // Smooth transition
            easing: Easing.out(Easing.quad),
            useNativeDriver: false, // Color interp isn't supported on native
        }).start();
    }, [isActive]);

    // Determine base colors
    let baseBg = '#e7e5e4'; // stone-200
    let baseBorder = '#a8a29e';
    if (note.isTonic) {
        if (note.octaveOffset === 0) {
            baseBg = '#991b1b'; // red-800
            baseBorder = '#7f1d1d';
        } else {
            baseBg = '#fca5a5'; // red-300
            baseBorder = '#b91c1c';
        }
    }

    const backgroundColor = animVal.interpolate({
        inputRange: [0, 1],
        outputRange: [baseBg, '#fbbf24'] // amber-400
    });

    const borderColor = animVal.interpolate({
        inputRange: [0, 1],
        outputRange: [baseBorder, '#d97706']
    });

    const scale = animVal.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.98]
    });

    return (
        <Animated.View
            style={[
                styles.key,
                {
                    backgroundColor,
                    borderColor,
                    transform: [{ scale }]
                }
            ]}
            onStartShouldSetResponder={() => true}
            onResponderGrant={onPlay}
            onResponderRelease={onStop}
            onResponderTerminate={() => {
                // ScrollView stole the touch. 
                // We do NOT stop the note here to allow play-while-scrolling.
                // Visual feedback will persist until parent clears isActive.
            }}
        >
            <View style={styles.labelContainer}>
                <Text style={[
                    styles.noteName,
                    (note.isTonic && !isActive) ? styles.textLight : styles.textDark,
                    // If playing (active), we might want dark text on amber bg? 
                    // Amber 400 is light-ish, so dark text is good.
                ]}>
                    {note.label}
                    {note.octaveOffset > 0 ? "'" : (note.octaveOffset < 0 ? "," : "")}
                </Text>
                <Text style={styles.centsText}>
                    {Math.round(note.centsFromBase)}¢
                </Text>
            </View>
        </Animated.View>
    );
};

const VerticalPiano: React.FC<VerticalPianoProps> = ({ glasId, baseFreq, webViewRef }) => {
    // Reverse the keys so that high notes are at the top (start of list) and low notes at the bottom
    const keys = useMemo(() => generateKeyboardMap(glasId).reverse(), [glasId]);

    // Track the currently playing note index for visual feedback
    const [activeNoteIndex, setActiveNoteIndex] = useState<number | null>(null);
    const [containerHeight, setContainerHeight] = useState(0);

    const activeNoteRef = useRef<number | null>(null);
    const scrollViewRef = useRef<ScrollView>(null);

    // Scroll to the main Tonic (octaveOffset 0) whenever the glas changes or layout is ready
    // Scroll to the middle of the list to show the central range
    useEffect(() => {
        if (containerHeight > 0 && keys.length > 0) {
            // Find the middle index to center the view roughly in the middle of the range
            const middleIndex = Math.floor(keys.length / 2);

            // Calculate position: 
            // padding (10) + index * (height 60 + gap 8)
            const itemHeight = 68;
            const y = 10 + middleIndex * itemHeight;

            // Center: y - (viewport/2) + (itemHeight(60)/2)
            const offset = y - (containerHeight / 2) + 30;

            // Add a small delay to ensure layout is stable
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    y: Math.max(0, offset),
                    animated: false
                });
            }, 100);
        }
    }, [glasId, containerHeight, keys]);

    const playNote = (note: NoteDefinition, index: number) => {
        const frequency = baseFreq * Math.pow(2, note.centsFromBase / 1200);
        if (webViewRef?.current) {
            const script = `window.playTone(${frequency}, ${index}, 'triangle');`;
            webViewRef.current.injectJavaScript(script);
        }
        setActiveNoteIndex(index);
        activeNoteRef.current = index;
    };

    const stopNote = (index: number) => {
        if (webViewRef?.current) {
            const script = `window.stopTone(${index});`;
            webViewRef.current.injectJavaScript(script);
        }
    };

    // Stop sound when the scroll gesture ends (finger lifted after dragging)
    const handleScrollEnd = () => {
        if (activeNoteRef.current !== null) {
            stopNote(activeNoteRef.current);
            setActiveNoteIndex(null);
            activeNoteRef.current = null;
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                onScrollEndDrag={handleScrollEnd}
                onMomentumScrollEnd={handleScrollEnd}
                onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
            >
                {keys.map((note, index) => (
                    <PianoKey
                        key={index}
                        note={note}
                        index={index}
                        isActive={activeNoteIndex === index}
                        onPlay={() => playNote(note, index)}
                        onStop={() => {
                            stopNote(index);
                            if (activeNoteRef.current === index) {
                                activeNoteRef.current = null;
                                setActiveNoteIndex(null);
                            }
                        }}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1917', // stone-950
    },
    scrollView: {
        flex: 1,
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
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    noteName: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'System',
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
