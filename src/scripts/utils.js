export const frequencyFromNoteNumber = noteNumber => {
    return 440 * Math.pow(2, (noteNumber - 69) / 12)
}

export const calculateAttackFrequency = (filterCutoff, filterEnvelopeAmount) => {
    return ((20000 - filterCutoff) * filterEnvelopeAmount) + filterCutoff
}

export const calculateSustainFrequency = (filterCutoff, filterEnvelopeAmount, filterSustainLevel) => {
    return calculateAttackFrequency(filterCutoff, filterEnvelopeAmount) * filterSustainLevel
}