import React from 'react'

import Envelope from './Envelope/Envelope'
import { calculateAttackFrequency, calculateSustainGain } from '../../utils'
import { buildCanvas } from '../../synth-charts'

export default class VCF extends React.Component {
  constructor (props) {
    super(props)

    this.setUpFilter = this.setUpFilter.bind(this)
    this.renderChildren = this.renderChildren.bind(this)

    this.setUpFilter()
  }

  setUpFilter () {
    this.audioContext = this.props.audioContext
    this.filter = this.audioContext.createBiquadFilter()
    this.filter.frequency.value = this.props.parameterValues.frequency.baseValue
    this.filter.connect(this.props.parentNode)
  }

  componentDidMount () {
    buildCanvas('filter-chart', {
      param: this.filter.frequency,
      moduleName: 'VCF',
      paramName: 'frequency'
    })  }

  componentDidUpdate (prevProps, nextProps) {
    if (prevProps.parameterValues.Q.baseValue !== this.props.parameterValues.Q.baseValue) {
      this.filter.Q.setValueAtTime(this.props.parameterValues.Q.baseValue, this.audioContext.currentTime)
    }
  }

  renderChildren () {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        parentNode: this.filter
      })
    })
  }

  render () {
    const envelopeProps = {
      audioContext: this.audioContext,
      currentKeys: this.props.currentKeys,
      parameterValues: this.props.parameterValues.frequency,
      gateStartTime: this.props.gateStartTime
    }
    
    return (
      <React.Fragment>
        <Envelope 
          param={this.filter.frequency} 
          {...envelopeProps}
          ref={envelope => (this.envelope = envelope)} />
        {this.renderChildren()}
      </React.Fragment>
    )
  }
}