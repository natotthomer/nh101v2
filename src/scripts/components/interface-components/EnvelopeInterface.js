import React from 'react'

import Range from '../input/Range'

export default class EnvelopeInterface extends React.Component {
  render () {
    return (
      <div className="module-controls-column">
        <Range {...this.props.attackTime} handleChange={this.props.handleChange} />
        <Range {...this.props.decayTime} handleChange={this.props.handleChange} />
        <Range {...this.props.sustainLevel} handleChange={this.props.handleChange} />
        <Range {...this.props.releaseTime} handleChange={this.props.handleChange} />
      </div>
    )
  }
}