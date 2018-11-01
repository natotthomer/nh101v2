import { buildVCO } from './VCO'
import { buildVCA } from './VCA'
import { buildVCF } from './VCF'

export default class Voice {
    constructor (audioContext) {
        this.audioContext = audioContext

        this.oscillator = buildVCO(audioContext)
        this.filter = buildVCF(audioContext)
        this.amplifier = buildVCA(audioContext)
        
        this.oscillator.connect(this.filter)
        this.filter.connect(this.amplifier)
        this.amplifier.connect(audioContext.destination)

        this.updateOscillatorFrequency = this.updateOscillatorFrequency.bind(this)
        this.updateAmpliferGain = this.updateAmpliferGain.bind(this)
        this.updateFilterFrequency = this.updateFilterFrequency.bind(this)
        this.updateFilterQ = this.updateFilterQ.bind(this)
    }

    updateOscillatorFrequency (newValue, atTime = this.audioContext.currentTime) {
        this.oscillator.frequency.setValueAtTime(newValue, atTime)
    }

    updateAmpliferGain (newValue, atTime = this.audioContext.currentTime) {
        this.amplifier.gain.linearRampToValueAtTime(newValue, atTime)
    }

    cancelAmplifierGainSchedule (atTime = this.audioContext.currentTime) {
        this.amplifier.gain.cancelScheduledValues(this.audioContext.currentTime)
    }

    updateFilterFrequency (newValue, atTime = this.audioContext.currentTime) {
        this.filter.frequency.linearRampToValueAtTime(newValue, atTime)
    }

    updateFilterQ (newValue, atTime = this.audioContext.currentTime) {
        this.filter.Q.linearRampToValueAtTime(newValue, atTime)
    }

    cancelAndHoldAtTime (atTime = this.audioContext.currentTime) {
        this.amplifier.gain.cancelAndHoldAtTime(atTime)
    }
}
