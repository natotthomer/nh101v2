import React from 'react'

import { REGISTERED_KEYS } from '../../constants/keyboard-constants'
import { calculateOscillatorFrequency } from '../../utils'


export default class VCO extends React.Component {
  constructor (props) {
    super(props)

    this.setUpOscillator = this.setUpOscillator.bind(this)
    this.renderChildren = this.renderChildren.bind(this)

    this.setUpOscillator()
  }

  setUpOscillator () {
    this.audioContext = this.props.audioContext
    this.oscillator = this.audioContext.createOscillator()
    this.oscillator.start()
    this.oscillator.type = 'sine'
    this.oscillator.frequency.value = 1000

    this.amplifier = this.audioContext.createGain()
    this.amplifier.gain.value = this.props.parameterValues.oscillatorGain

    this.oscillator.connect(this.amplifier)
    this.amplifier.connect(this.props.parentNode)
  }

  componentDidUpdate (prevProps, prevState) {
    const { currentKey, parameterValues } = this.props
    const indexOfKey = REGISTERED_KEYS.indexOf(currentKey)
    if (indexOfKey >= 0) {
      const { oscillatorDetune, oscillatorOctave, oscillatorWaveform } = parameterValues
      const noteNumber = indexOfKey + (12 * oscillatorOctave)
      const newValue = calculateOscillatorFrequency(noteNumber, oscillatorDetune)
      this.oscillator.frequency.setValueAtTime(newValue, this.audioContext.currentTime)
      this.oscillator.type = oscillatorWaveform
    } else if (parameterValues.oscillatorGain !== prevProps.parameterValues.oscillatorGain) {
      this.amplifier.gain.setValueAtTime(parameterValues.oscillatorGain, this.audioContext.currentTime)
    }
  }


  renderChildren () {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        parentNode: this.oscillator
      })
    })
  }

  render () {
    return (
      <React.Fragment>
        {this.renderChildren()}
      </React.Fragment>
    )
  }
}