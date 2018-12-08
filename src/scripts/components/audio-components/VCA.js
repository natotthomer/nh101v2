import React from 'react'

import Envelope from './Envelope'

export default class VCA extends React.Component {
  constructor (props) {
    super(props)

    this.setUpAmplifier = this.setUpAmplifier.bind(this)
    this.renderChildren = this.renderChildren.bind(this)

    this.setUpAmplifier()
  }

  setUpAmplifier () {
    this.audioContext = this.props.audioContext
    this.amplifier = this.audioContext.createGain()
    this.amplifier.gain.value = 0
    this.amplifier.connect(this.audioContext.destination)
  }
  
  connectInput (input) {
    input.connect(this.amplifier)
  }

  renderChildren () {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        parentNode: this.amplifier
      })
    })
  }
  
  render () {
    const envelopeProps = {
      audioContext: this.audioContext,
      currentKeys: this.props.currentKeys,
      moduleParameter: this.props.moduleParameters.gain
    }

    return (
      <React.Fragment>
        VCA
        <Envelope param={this.amplifier.gain} {...envelopeProps} />
        {this.renderChildren()}
      </React.Fragment>
    )
  }
}