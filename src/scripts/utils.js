const frequencyFromNoteNumber = noteNumber => {
    return 440 * Math.pow(2, (noteNumber - 69) / 12)
}

export const calculateOscillatorFrequency = (noteNumber, detuneAmount) => {
    const baseFrequency = frequencyFromNoteNumber(noteNumber)
    let adjustedFrequency = baseFrequency
    if (detuneAmount > 0) {
        const frequencyOfNextNoteUp = frequencyFromNoteNumber(noteNumber + 1)
        adjustedFrequency += (frequencyOfNextNoteUp - adjustedFrequency) * detuneAmount
    } else if (detuneAmount < 0) {
        const frequencyOfNextNoteDown = frequencyFromNoteNumber(noteNumber - 1)
        adjustedFrequency -= (adjustedFrequency - frequencyOfNextNoteDown) * detuneAmount
    }
    console.log(baseFrequency)
    console.log(adjustedFrequency)
    return adjustedFrequency
}

export const calculateAttackFrequency = (filterCutoff, filterEnvelopeAmount) => {
    return ((20000 - filterCutoff) * filterEnvelopeAmount) + filterCutoff
}

export const calculateSustainFrequency = (filterCutoff, filterEnvelopeAmount, filterSustainLevel) => {
    return calculateAttackFrequency(filterCutoff, filterEnvelopeAmount) * filterSustainLevel
}