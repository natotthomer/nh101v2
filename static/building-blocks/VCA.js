export const buildVCA = (audioContext) => {
    const amplifier = audioContext.createGain()

    amplifier.gain.setValueAtTime(0, audioContext.currentTime)

    return amplifier
};