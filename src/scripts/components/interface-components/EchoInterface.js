import React from 'react'

import Range from '../input/Range'

const VCAInterface = props => {
  const { echoTime, echoFeedback, echoVolume, echoLFOSpeed, echoLFOAmount, echoLPFFrequency } = props.echo


  const inputSettings = {
    echoTime: {
      title: 'Time',
      min: 0.001,
      max: 10.0,
      step: 0.001,
      valueType: 'float',
      parameter: 'echoTime',
      value: echoTime
    },
    echoFeedback: {
      title: 'Feedback',
      min: 0.000,
      max: 1.0,
      step: 0.001,
      valueType: 'float',
      parameter: 'echoFeedback',
      value: echoFeedback
    },
    echoVolume: {
      title: 'Volume',
      min: 0.0,
      max: 1.0,
      step: 0.001,
      valueType: 'float',
      parameter: 'echoVolume',
      value: echoVolume
    },
    echoLFOSpeed: {
      title: 'LFO Speed',
      min: 0.001,
      max: 1.0,
      step: 0.001,
      valueType: 'float',
      parameter: 'echoLFOSpeed',
      value: echoLFOSpeed
    },
    echoLFOAmount: {
      title: 'LFO Amount',
      min: 0.0,
      max: 0.1,
      step: 0.001,
      valueType: 'float',
      parameter: 'echoLFOAmount',
      value: echoLFOAmount
    },
    echoLPFFrequency: {
      title: 'LPF Cutoff',
      min: 100,
      max: 2000,
      step: 0.001,
      valueType: 'float',
      parameter: 'echoLPFFrequency',
      value: echoLPFFrequency
    }
  }
  
  return (
    <React.Fragment>
      <div className="module-controls-column">
        <Range {...inputSettings.echoTime} handleChange={props.updateEcho} />
        <Range {...inputSettings.echoFeedback} handleChange={props.updateEcho} />
        <Range {...inputSettings.echoVolume} handleChange={props.updateEcho} />
        <Range {...inputSettings.echoLFOSpeed} handleChange={props.updateEcho} />
        <Range {...inputSettings.echoLFOAmount} handleChange={props.updateEcho} />
        <Range {...inputSettings.echoLPFFrequency} handleChange={props.updateEcho} />
      </div>

    </React.Fragment>
  )
}

export default VCAInterface