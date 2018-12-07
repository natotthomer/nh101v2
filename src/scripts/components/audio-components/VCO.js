import React from 'react'

import { REGISTERED_KEYS } from '../../constants/keyboard-constants'
import { calculateOscillatorFrequency, createNode } from '../../utils'


export default class VCO extends React.Component {
    constructor (props) {
        super(props)

        this.oscillator = createNode(this.props.audioContext, 'oscillator')
        this.gain = createNode(this.props.audioContext, 'gain')
    }

    // componentDidUpdate (prevProps, prevState) {
    //     const currentKey = this.props.currentKeys[this.props.currentKeys.length - 1]
    //     const indexOfKey = REGISTERED_KEYS.indexOf(currentKey)
    //     if (indexOfKey >= 0) {
    //         const noteNumber = indexOfKey + (12 * this.props.oscillatorOctave)
    //         const newValue = calculateOscillatorFrequency(noteNumber, this.props.oscillatorDetune)
    //         this.oscillator.frequency.setValueAtTime(newValue, this.props.audioContext.currentTime)
    //     }
    //     this.oscillator.type = this.props.oscillatorWaveform
    // }

    render () {
        return null
    }
}