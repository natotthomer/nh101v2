import React from 'react'

import EnvelopeInterface from './EnvelopeInterface'
import Range from '../input/Range'

import { RESPONSE_TYPES } from '../../constants/synth-constants'

const VCFInterface = props => {
  const { 
    attackTime, 
    decayTime, 
    sustainLevel, 
    releaseTime, 
    baseValue, 
    envelopeAmount,
    envelopeResponseType
  } = props.vcf.frequency
  
  const inputSettings = {
    cutoff: {
      title: 'cutoff',
      min: 20,
      max: 20000,
      step: 0.001,
      valueType: 'float',
      audioParam: 'frequency',
      parameter: 'baseValue',
      value: baseValue
    },
    resonance: {
      title: 'resonance',
      min: 0.001,
      max: 40,
      step: 0.001,
      valueType: 'float',
      audioParam: 'Q',
      parameter: 'baseValue',
      value: props.vcf.Q.baseValue
    },
    envelopeAmount: {
      title: 'Envelope Amount',
      min: 0.0,
      max: 1.0,
      step: 0.001,
      valueType: 'float',
      audioParam: 'frequency',
      parameter: 'envelopeAmount',
      value: envelopeAmount
    },
    attackTime: {
      title: 'Attack',
      min: 0.001,
      max: 10.0,
      step: 0.001,
      valueType: 'float',
      audioParam: 'frequency',
      parameter: 'attackTime',
      value: attackTime
    },
    decayTime: {
      title: 'Decay',
      min: 0.001,
      max: 10.0,
      step: 0.001,
      valueType: 'float',
      audioParam: 'frequency',
      parameter: 'decayTime',
      value: decayTime
    },
    sustainLevel: {
      title: 'Sustain',
      min: 0.0,
      max: 1.0,
      step: 0.001,
      valueType: 'float',
      audioParam: 'frequency',
      parameter: 'sustainLevel',
      value: sustainLevel
    },
    releaseTime: {
      title: 'Release',
      min: 0.001,
      max: 10.0,
      step: 0.001,
      valueType: 'float',
      audioParam: 'frequency',
      parameter: 'releaseTime',
      value: releaseTime
    },
    envelopeResponseType: {
      title: 'Response',
      options: RESPONSE_TYPES,
      valueType: 'string',
      parameter: 'envelopeResponseType',
      value: envelopeResponseType,
      audioParam: 'frequency'
    }
  }
  
  return (
    <React.Fragment>
      <div className="module-controls-column">
        <EnvelopeInterface
          name={'filter'}
          handleChange={props.updateVCF}
          attackTime={Object.assign({}, inputSettings.attackTime)}
          decayTime={Object.assign({}, inputSettings.decayTime)}
          sustainLevel={Object.assign({}, inputSettings.sustainLevel)}
          releaseTime={Object.assign({}, inputSettings.releaseTime)}
          envelopeResponseType={Object.assign({}, inputSettings.envelopeResponseType)} />
      </div>
      <div className="module-controls-column">
        <Range {...inputSettings.cutoff} handleChange={props.updateVCF} />
        <Range {...inputSettings.resonance} handleChange={props.updateVCF} />
        <Range {...inputSettings.envelopeAmount} handleChange={props.updateVCF} />
      </div>
    </React.Fragment>
  )
}

export default VCFInterface