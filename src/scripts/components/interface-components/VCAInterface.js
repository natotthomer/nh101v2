import React from 'react'

import EnvelopeInterface from './EnvelopeInterface'
import Range from '../input/Range'

import { RESPONSE_TYPES } from '../../constants/synth-constants'

const VCAInterface = props => {
  const { 
    attackTime, 
    decayTime, 
    sustainLevel, 
    releaseTime,
    envelopeResponseType
  } = props.vca.gain

  const inputSettings = {
    attackTime: {
      title: 'Attack',
      min: 0.001,
      max: 10.0,
      step: 0.001,
      valueType: 'float',
      audioParam: 'gain',
      parameter: 'attackTime',
      value: attackTime
    },
    decayTime: {
      title: 'Decay',
      min: 0.001,
      max: 10.0,
      step: 0.001,
      valueType: 'float',
      audioParam: 'gain',
      parameter: 'decayTime',
      value: decayTime
    },
    sustainLevel: {
      title: 'Sustain',
      min: 0.0,
      max: 1.0,
      step: 0.001,
      valueType: 'float',
      audioParam: 'gain',
      parameter: 'sustainLevel',
      value: sustainLevel
    },
    releaseTime: {
      title: 'Release',
      min: 0.001,
      max: 10.0,
      step: 0.001,
      valueType: 'float',
      audioParam: 'gain',
      parameter: 'releaseTime',
      value: releaseTime
    },
    envelopeResponseType: {
      title: 'Response',
      options: RESPONSE_TYPES,
      valueType: 'string',
      parameter: 'envelopeResponseType',
      value: envelopeResponseType,
      audioParam: 'gain'
    }
  }
  
  return (
    <React.Fragment>
      <div className="module-controls-column">
        <EnvelopeInterface
          name={'amplifier'}
          handleChange={props.updateVCA}
          attackTime={Object.assign({}, inputSettings.attackTime)}
          decayTime={Object.assign({}, inputSettings.decayTime)}
          sustainLevel={Object.assign({}, inputSettings.sustainLevel)}
          releaseTime={Object.assign({}, inputSettings.releaseTime)}
          envelopeResponseType={Object.assign({}, inputSettings.envelopeResponseType)} />
      </div>
    </React.Fragment>
  )
}

export default VCAInterface