import React from 'react'

import Envelope from './Envelope/Envelope'
import { calculateAttackFrequency, calculateSustainFrequency } from '../../utils'
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
    this.filter.frequency.value = this.props.moduleParameters.frequency.baseValue
    this.filter.connect(this.props.parentNode)
  }

  componentDidMount () {
    buildCanvas(this.filter.frequency, 'filter-chart')
  }

  componentDidUpdate (prevProps, nextProps) {
    if (prevProps.moduleParameters.frequency.baseValue !== this.props.moduleParameters.frequency.baseValue) {
      this.filter.frequency.setValueAtTime(this.props.moduleParameters.frequency.baseValue, this.audioContext.currentTime)

      if (prevProps.currentKeys.length > 0) {
        this.envelope.recalibrateEnvelope()
      }
    }
  }

  // triggerEnvelope (prevProps) {
  //     const { 
  //         audioContext, 
  //         currentKeys, 
  //         filterAttackTime, 
  //         filterDecayTime,
  //         filterSustainLevel,
  //         filterReleaseTime,
  //         filterCutoffFrequency,
  //         filterEnvelopeAmount
  //     } = this.props
      
  //     const currentKey = currentKeys[currentKeys.length - 1]
  //     const prevKey = prevProps.currentKeys[prevProps.currentKeys.length - 1]
      
  //     if (((currentKeys.length > 1) || (prevProps.currentKeys.includes(currentKey) && currentKeys.length === 1)) && !this.props.retrigger) {
  //         // if retrigger mode is off, then we don't want to retrigger the envelope when we receive 
  //         // new key events, we just want to continue the envelope from where it left off
  //     } else if (currentKeys.length > 0 && currentKey !== prevKey) {
  //         // retrigger envelope on receiving new key press or removing a key with more keys 
  //         // still engaged
  //         this.setState({
  //             attackStageEnd: audioContext.currentTime + filterAttackTime, 
  //             decayStageEnd: audioContext.currentTime + filterAttackTime + filterDecayTime, 
  //             sustainStageEnd: null,
  //             releaseStageEnd: null
  //         })

  //         const attackFrequency = calculateAttackFrequency(filterCutoffFrequency, filterEnvelopeAmount)
  //         const sustainFrequency = calculateSustainFrequency(filterCutoffFrequency, filterEnvelopeAmount, filterSustainLevel)
          
  //         this.cancelScheduledValues()
  //         this.updateFrequency(filterCutoffFrequency)
  //         this.updateFrequency(attackFrequency, filterAttackTime + audioContext.currentTime, 'linear')
  //         this.updateFrequency(sustainFrequency, filterDecayTime + filterAttackTime + audioContext.currentTime, 'linear')
  //     } else if (currentKey !== prevKey && currentKey === undefined) {
  //         // initiate Release stage
  //         this.cancelScheduledValues()
  //         this.updateFrequency(this.filters[0].frequency.value)
  //         this.updateFrequency(this.props.filterCutoffFrequency, this.props.filterReleaseTime + audioContext.currentTime, 'linear')
  //         this.setState({ attackStageEnd: null, decayStageEnd: null, releaseStageEnd: audioContext.currentTime + filterReleaseTime, sustainStageEnd: audioContext.currentTime })
  //     }
  // }

  
  // updateFrequency (newValue, atTime=this.props.audioContext.currentTime, slopeType=null) {
  //     switch (slopeType) {
  //         case 'exponential': {
  //             // Will break if `newValue` is 0 and slopeType is `exponential` (needs to
  //             // ANY number greater or lesser than 0.)
  //             this.filters.forEach(filter => {
  //                 filter.frequency.exponentialRampToValueAtTime(newValue, atTime)
  //             })
  //             break
  //         }
  //         case 'linear': {
  //             this.filters.forEach(filter => {
  //                 filter.frequency.linearRampToValueAtTime(newValue, atTime)
  //             })
  //             break
  //         }
  //         default: {
  //             this.filters.forEach(filter => {
  //                 filter.frequency.setValueAtTime(newValue, atTime)
  //             })
  //             break
  //         }
  //     }
  // }

  // updateQ (newValue, atTime=this.props.audioContext.currentTime, slopeType=null) {
  //     switch (slopeType) {
  //         case 'exponential': {
  //             // Will break if `newValue` is 0 and slopeType is `exponential` (needs to
  //             // ANY number greater or lesser than 0.)
  //             this.filters.forEach(filter => {
  //                 filter.Q.exponentialRampToValueAtTime(newValue, atTime)
  //             })
  //             break
  //         }
  //         case 'linear': {
  //             this.filters.forEach(filter => {
  //                 filter.Q.linearRampToValueAtTime(newValue, atTime)
  //             })
  //             break
  //         }
  //         default: {
  //             this.filters.forEach(filter => {
  //                 filter.Q.setValueAtTime(newValue, atTime)
  //             })
  //             break
  //         }
  //     }
  // }

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
      moduleParameter: this.props.moduleParameters.frequency,
      retrigger: this.props.retrigger,
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