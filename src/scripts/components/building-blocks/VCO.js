import React from 'react'

import { REGISTERED_KEYS } from '../../constants/keyboard-constants'
import { frequencyFromNoteNumber } from '../../utils'


export default class VCO extends React.Component {
    constructor (props) {
        super(props)

        this.oscillator = this.props.audioContext.createOscillator()

        this.oscillator.type = 'sawtooth'
        this.oscillator.start()
    }

    componentDidUpdate (prevProps, prevState) {
        const currentKey = this.props.currentKeys[this.props.currentKeys.length - 1]
        const indexOfKey = REGISTERED_KEYS.indexOf(currentKey)
        if (indexOfKey >= 0) {
            const noteNumber = indexOfKey + (12 * this.props.oscillatorOctave)
            const newValue = frequencyFromNoteNumber(noteNumber)
            this.oscillator.frequency.setValueAtTime(newValue, this.props.audioContext.currentTime)
        }
    }

    render () {
        return null
    }
}