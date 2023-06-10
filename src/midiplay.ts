import easymidi, { Note as INote } from 'easymidi';
import { Note } from "@tonaljs/tonal";
import { TNoteAllAccidentalOctave } from './utils';

export interface INotePlay {
    noteNames: Readonly<TNoteAllAccidentalOctave[]>,
    duration: 0.5 | 1 | 2 | 3 | 4;
}

var output = new easymidi.Output('Microsoft GS Wavetable Synth');

const channelObj: INote = {
    note: 0,
    velocity: 127,
    channel: 3
}

function note_play(note: number, activator: "noteon" | "noteoff", channel: number) {
    // @ts-ignore
    output.send(activator, { ...channelObj, note, channel : channel });
}


export async function play_midi(notes: INotePlay[], { signal }: any, channel : number, tempo : number): Promise<void> {

    const timers: any[] = [];
    const on_abort = () => {
        timers.forEach(timer =>  clearTimeout(timer))
        abort_notes_play();
    };
    signal.addEventListener('abort', on_abort, { once: true });

    const notesNames = notes.map(note => { return { ...note, noteNumbers: note.noteNames.map(noteName => Note.midi(noteName) as number) } })

    function abort_notes_play() {
        for (const note of notesNames) {
            for (const noteNumber of note.noteNumbers) {
                note_play(noteNumber, "noteoff", channel)
            }
        }
    }

    let totalTime = 0;
    let currentNotes: number[]  = [];

    for (const note of [...notesNames, {noteNumbers: [], duration : 0}]) {
        let timer = setTimeout(() => {
            currentNotes.forEach(n => note_play(n, "noteoff", channel))
            currentNotes = note.noteNumbers;
            note.noteNumbers.forEach(n => note_play(n, "noteon", channel))
        }, totalTime)
        totalTime += tempo * note.duration
        timers.push(timer)
    }
}
