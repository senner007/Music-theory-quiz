import easymidi, { Note as INote } from 'easymidi';
import { Note } from "@tonaljs/tonal";
import { TNoteAllAccidentalOctave } from './utils';

export interface INotePlay {
    noteNames: Readonly<TNoteAllAccidentalOctave[]>,
    duration: 1 | 2 | 3 | 4;
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


export async function play_midi(notes: INotePlay[], { signal }: any, channel : number, timerObj: any, tempo : number): Promise<void> {

    let abort: boolean = false;

    const on_abort = () => {
        clearTimeout(timerObj)
        abort = true;
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

    for (const note of notesNames) {
        if (abort) break;

        for (let index = 0; index < note.noteNumbers.length; index++) {
            note_play(note.noteNumbers[index], "noteon", channel)
        }

        await new Promise((res) => {
            timerObj = setTimeout(() => { res(0) } , tempo * note.duration)
        });

        for (let index = 0; index < note.noteNumbers.length; index++) {
            note_play(note.noteNumbers[index], "noteoff", channel)
        }
    }
}
