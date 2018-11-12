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
            parameter: 'oscillatorOctave'
        },
        detune: {
            title: 'detune',
            min: -1.0,
            max: 1.0,
            step: 0.001,
            valueType: 'float',
            parameter: 'oscillatorDetune'
        },
        gain: {
            title: 'gain',
            min: 0.0,
            max: 1.0,
            step: 0.001,
            valueType: 'integer',
            parameter: 'oscillatorGain'
        },
        waveform: {
            title: 'waveform',
            options: WAVEFORMS,
            valueType: 'string',
            parameter: 'oscillatorWaveform'
        }
    }
    
    return (
        <div className="module-controls-column">
            <Range {...props.vco} {...inputSettings.octave} handleChange={props.updateVCO} />
            <Range {...props.vco} {...inputSettings.detune} handleChange={props.updateVCO} />
            <Dropdown {...props.vco} {...inputSettings.waveform} handleChange={props.updateVCO} />
            <Range {...props.vco} {...inputSettings.gain} handleChange={props.updateVCO} />
        </div>
    )
}

export default VCOInterface