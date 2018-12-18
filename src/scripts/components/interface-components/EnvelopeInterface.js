import React from 'react'

import Range from '../input/Range'
import Dropdown from '../input/Dropdown'
import Checkbox from '../input/Checkbox'

const EnvelopeInterface = props => {
  return (
    <div className="module-controls-column">
      <Range {...props.attackTime} handleChange={props.handleChange} />
      <Range {...props.decayTime} handleChange={props.handleChange} />
      <Range {...props.sustainLevel} handleChange={props.handleChange} />
      <Range {...props.releaseTime} handleChange={props.handleChange} />
      <Dropdown {...props.envelopeResponseType} handleChange={props.handleChange} />
      <Checkbox {...props.envelopeRetrigger} handleChange={props.handleChange} />
    </div>
  )
}

export default EnvelopeInterface