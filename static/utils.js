export const frequencyFromNoteNumber = noteNumber => {
    return 440 * Math.pow(2, (noteNumber - 69) / 12)
}