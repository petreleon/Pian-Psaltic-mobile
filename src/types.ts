export type NoteName = 'Ni' | 'Pa' | 'Vu' | 'Ga' | 'Di' | 'Ke' | 'Zo';

export interface GlasDefinition {
    id: number;
    name: string;
    baseNote: NoteName;
    description: string;
    intervals: number[]; // In Moria (72-ET)
}

export interface NoteDefinition {
    name: NoteName;
    label: string;
    centsFromBase: number;
    isTonic: boolean;
    octaveOffset: number;
}
