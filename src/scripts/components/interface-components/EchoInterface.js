import React from 'react'

import Range from '../input/Range'

const VCAInterface = props => {
  const { echoTime, echoFeedback, echoVolume } = props.echo


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
      max: 10.0,
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
    }
  }
  
  return (
    <React.Fragment>
      <div className="module-controls-column">
        <Range {...inputSettings.echoTime} handleChange={props.updateEcho} />
        <Range {...inputSettings.echoFeedback} handleChange={props.updateEcho} />
        <Range {...inputSettings.echoVolume} handleChange={props.updateEcho} />
      </div>

    </React.Fragment>
  )
}

export default VCAInterface