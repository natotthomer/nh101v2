import React from 'react'

import Envelope from './Envelope/Envelope'
// import { buildCanvas } from '../../synth-charts'

export default class VCA extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      envelopeIsOn: false
    };

    this.envelope = React.createRef();
    
    this.setUpAmplifier = this.setUpAmplifier.bind(this)
    this.renderChildren = this.renderChildren.bind(this)
    this.getOutput = this.getOutput.bind(this)

    this.setUpAmplifier()
  }
  
  // componentDidMount () {
  //   buildCanvas('amp-chart', {
  //     param: this.amplifier.gain,
  //     moduleName: 'VCA',
  //     paramName: 'gain'
  //   })
  // }

  setUpAmplifier () {
    this.audioContext = this.props.audioContext
    this.amplifier = this.audioContext.createGain()
    this.amplifier.gain.value = 0
    this.amplifier.connect(this.props.parentNode)
    this.amplifier.connect(this.audioContext.destination)
  }

  getOutput () {
    return this.amplifier
  }

  getEnvelopeIsOn () {
    this.setState({
      envelopeIsOn: !this.state.envelopeIsOn
    });
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
      currentKey: this.props.currentKey,
      gateStartTime: this.props.gateStartTime,
      parameterValues: this.props.parameterValues.gain
    }

    return (
      <React.Fragment>
        <Envelope
          ref={this.envelope}
          param={this.amplifier.gain}
          {...envelopeProps} />
        {this.renderChildren()}
      </React.Fragment>
    )
  }
}