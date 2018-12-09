import React from 'react'

import Range from '../input/Range'
import Dropdown from '../input/Dropdown'

const WAVEFORMS = [ 'sawtooth', 'triangle', 'square', 'sine' ]

const VCOInterface = props => {
  const inputSettings = {
    octave: {
      title: 'octave',
      min: 1,
      max: 8,
      step: 1,
      valueType: 'integer',
      parameter: 'oscillatorOctave',
      value: props.oscillatorOctave,
      id: props.id
    },
    detune: {
      title: 'detune',
      min: -1.0,
      max: 1.0,
      step: 0.001,
      valueType: 'float',
      parameter: 'oscillatorDetune',
      value: props.oscillatorDetune,
      id: props.id
    },
    gain: {
      title: 'gain',
      min: 0.0,
      max: 1.0,
      step: 0.001,
      valueType: 'float',
      parameter: 'oscillatorGain',
      value: props.oscillatorGain,
      id: props.id
    },
    waveform: {
      title: 'waveform',
      options: WAVEFORMS,
      valueType: 'string',
      parameter: 'oscillatorWaveform',
      value: props.oscillatorWaveform,
      id: props.id
    }
  }
  
  return (
    <div className="module-controls-column">
      <Range {...inputSettings.octave} handleChange={props.updateVCO} />
      <Range {...inputSettings.detune} handleChange={props.updateVCO} />
      <Dropdown {...inputSettings.waveform} handleChange={props.updateVCO} />
      <Range {...inputSettings.gain} handleChange={props.updateVCO} />
    </div>
  )
}

export default VCOInterface