export const buildVCF = (audioContext) => {
    const filter = audioContext.createBiquadFilter()

    filter.frequency.value = 1000
    filter.Q.value = 5

    return filter
};