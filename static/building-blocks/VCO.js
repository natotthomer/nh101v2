export const buildVCO = (audioContext) => {
    const oscillator = audioContext.createOscillator()

    oscillator.type = 'triangle'
    oscillator.start()

    return oscillator
};