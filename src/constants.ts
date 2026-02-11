import { GlasDefinition, NoteName, NoteDefinition } from './types';

// =========================================================================================
// CONSTANTS & CONVERSION
// =========================================================================================

// In the Chrysanthine system, the octave is divided into 72 equal parts called "Moria".
// 1 Octave = 72 Moria = 1200 Cents.
// 1 Moria = 1200 / 72 = 16.666... Cents.
const CENTS_PER_MORIA = 1200 / 72;

export const BASE_NOTE_FREQUENCIES: Record<string, number> = {
    'Ni': 261.63, // C4
    'Pa': 293.66, // D4
    'Vu': 329.63, // E4 (approx)
    'Ga': 349.23, // F4
    'Di': 392.00, // G4
    'Ke': 440.00, // A4
    'Zo': 493.88  // B4
};

// --- INTERVAL DEFINITIONS (IN MORIA) ---

// 1. DIATONIC (Scara Diatonica)
// Structure: 12 - 10 - 8 - 12 - 12 - 10 - 8
// Used in: Glas 1, Glas 4 (Legetos varied), Glas 5, Glas 8
const DIATONIC_MORIA = [12, 10, 8, 12, 12, 10, 8];

// 2. CHROMATIC SOFT (Cromatic Moale) - Glas 2
// Structure: 8 - 14 - 8 - 12 - 8 - 14 - 8
// Note: Some sources might vary slightly, but 8-14-8 is standard for the chromatic tetrachord.
const CHROMATIC_SOFT_MORIA = [8, 14, 8, 12, 8, 14, 8];

// 3. CHROMATIC HARD (Cromatic Tare) - Glas 6 / Glas 2 Tare
// Structure: 6 - 20 - 4 - 12 - 6 - 20 - 4
// A very sharp distinct sound.
const CHROMATIC_HARD_MORIA = [6, 20, 4, 12, 6, 20, 4];

// 4. ENHARMONIC (Enharmonic / Major-ish) - Glas 3
// Generic structure often mapped to Western Major (F Major): 12 - 12 - 6 - 12 - 12 - 12 - 6
// Note: True Enharmonic in Byzantine music is distinct, but for digital keyboards, 
// this approximation (Major Scale) is often used for Glas 3.
const ENHARMONIC_MORIA = [12, 12, 6, 12, 12, 12, 6];

// 5. ENHARMONIC VARYS (Glas 7)
// Often treated as Diatonic originating from Zo (B) or Fa (F).
// Using the "Diatonic from Zo" definition (Mixolydian-ish).
// Intervals from Zo: 8, 12, 10, 8, 12, 12, 10 (Matches Standard Diatonic Cycle: Zo->Ni(8)->Pa(12)->Vu(10)->Ga(8)->Di(12)...)
const VARYS_MORIA = [8, 12, 10, 8, 12, 12, 10];


export const NOTE_NAMES: NoteName[] = ['Ni', 'Pa', 'Vu', 'Ga', 'Di', 'Ke', 'Zo'];

// Definitions for the 8 Glasuri (Modes)
// Intervals are now stored in MORIA.
export const GLASURI: GlasDefinition[] = [
    {
        id: 1,
        name: "Glasul 1",
        baseNote: 'Pa',
        description: "Diatonic (Baza: Pa) [Gr: Echos Protos]",
        intervals: [10, 8, 12, 12, 10, 8, 12] // Starts from Pa (Re). Intervals follow Diatonic cycle from Pa.
        // Diatonic Cycle: Ni(12)Pa(10)Vu(8)Ga(12)Di(12)Ke(10)Zo(8)Ni
        // From Pa: Pa->Vu(10), Vu->Ga(8), Ga->Di(12), Di->Ke(12), Ke->Zo(10), Zo->Ni(8), Ni->Pa(12)
    },
    {
        id: 2,
        name: "Glasul 2",
        baseNote: 'Di',
        description: "Chromatic Moale (Baza: Di) [Gr: Echos Deuterus]",
        intervals: CHROMATIC_SOFT_MORIA // 8, 14, 8...
    },
    {
        id: 3,
        name: "Glasul 3",
        baseNote: 'Ga',
        description: "Enharmonic (Baza: Ga) [Gr: Echos Tritos]",
        intervals: ENHARMONIC_MORIA // 12, 12, 6... (Major scale approx)
    },
    {
        id: 4,
        name: "Glasul 4 (Legetos)",
        baseNote: 'Vu',
        description: "Diatonic Legetos (Baza: Vu) [Gr: Echos Tetartos]",
        // Legetos often slightly raises Vu or modifies the scale.
        // Standard Diatonic from Vu:  Vu->Ga(8), Ga->Di(12), Di->Ke(12), Ke->Zo(10), Zo->Ni(8), Ni->Pa(12), Pa->Vu(10)
        intervals: [8, 12, 12, 10, 8, 12, 10]
    },
    {
        id: 5,
        name: "Glasul 5",
        baseNote: 'Pa',
        description: "Diatonic (Baza: Pa - similar Glas 1) [Gr: Echos Plagios Protos]",
        // Same as Glas 1 essentially
        intervals: [10, 8, 12, 12, 10, 8, 12]
    },
    {
        id: 6,
        name: "Glasul 6",
        baseNote: 'Pa',
        description: "Chromatic Tare (Baza: Pa) [Gr: Echos Plagios Deuterus]",
        intervals: CHROMATIC_HARD_MORIA // 6, 20, 4...
    },
    {
        id: 7,
        name: "Glasul 7 (Varys)",
        baseNote: 'Zo',
        description: "Enharmonic/Diatonic (Baza: Zo) [Gr: Echos Varys]",
        intervals: VARYS_MORIA // 8, 12, 10...
    },
    {
        id: 8,
        name: "Glasul 8",
        baseNote: 'Ni',
        description: "Diatonic (Baza: Ni) [Gr: Echos Plagios Tetartos]",
        intervals: DIATONIC_MORIA // 12, 10, 8...
    }
];

// Helper to generate the full keyboard layout based on selected glas
export const generateKeyboardMap = (glasId: number): NoteDefinition[] => {
    const glas = GLASURI.find(g => g.id === glasId) || GLASURI[0];
    const notes: NoteDefinition[] = [];

    // The sequence of names is circular: Ni, Pa, Vu, Ga, Di, Ke, Zo, Ni...
    const baseNameIndex = NOTE_NAMES.indexOf(glas.baseNote);

    // We want: 
    // 1. The Main Octave (Base -> Base + 7 steps)
    // 2. 4 notes below Base
    // 3. 4 notes above Main Octave
    // Total range: -4 to +11 (relative to base index 0)

    const rangeStart = -4;
    const rangeEnd = 11; // Base is 0. 7 is octave. 11 is octave + 4.

    for (let i = rangeStart; i <= rangeEnd; i++) {
        // Determine Note Name
        let nameIndex = (baseNameIndex + i) % 7;
        if (nameIndex < 0) nameIndex += 7;
        const noteName = NOTE_NAMES[nameIndex];

        // Determine Octave Offset relative to the Base Note's natural octave
        // i=0 is base. i=7 is base+octave. i=-7 is base-octave.
        const octaveShift = Math.floor(i / 7);

        // Calculate Moria Sum first
        // We need to sum intervals from 0 to i.
        let moriaSum = 0;

        if (i > 0) {
            // Sum intervals going up
            for (let j = 0; j < i; j++) {
                // Use modulo to cycle through the interval pattern of the Glas
                moriaSum += glas.intervals[j % 7];
            }
        } else if (i < 0) {
            // Sum intervals going down (subtracting)
            for (let j = -1; j >= i; j--) {
                // When going down from 0, we look at the interval BEFORE our current position
                let intervalIndex = (j % 7);
                if (intervalIndex < 0) intervalIndex += 7;

                moriaSum -= glas.intervals[intervalIndex];
            }
        }

        // Convert Moria to Cents
        const cents = moriaSum * CENTS_PER_MORIA;

        notes.push({
            name: noteName,
            label: noteName,
            centsFromBase: cents,
            isTonic: i === 0 || i % 7 === 0,
            octaveOffset: octaveShift
        });
    }

    return notes;
};
