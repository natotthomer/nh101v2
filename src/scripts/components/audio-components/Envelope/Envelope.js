import React from 'react'

import { makeLogarithmicSlope } from '../../../utils'


export default class Envelope extends React.Component {
  constructor (props) {
    super(props)

    this.param = this.props.param
    this.audioContext = this.props.audioContext
    
    this.triggerEnvelope = this.triggerEnvelope.bind(this)
    this.updateAudioParam = this.updateAudioParam.bind(this)
    this.cancelScheduledValues = this.cancelScheduledValues.bind(this)
    this.getValueToAttackTo = this.getValueToAttackTo.bind(this)
    this.getValueToDecayTo = this.getValueToDecayTo.bind(this)
    this.resetAtValue = this.resetAtValue.bind(this)
    this.resetToBaseValue = this.resetToBaseValue.bind(this)
    this.scheduleAttackStage = this.scheduleAttackStage.bind(this)
    this.scheduleDecayStage = this.scheduleDecayStage.bind(this)
    this.scheduleReleaseStage = this.scheduleReleaseStage.bind(this)

    this.state = {
      time: 0.0,
      attackStageEnd: null,
      decayStageEnd: null,
      releaseStageEnd: null,
      sustainStageEnd: null
    }
  }

  componentDidUpdate (prevProps, prevState) {
    // need state handling for retrigger-per-adsr
    const { currentKeys, retrigger } = this.props


    const currentKey = currentKeys[currentKeys.length - 1]
    const prevKey = prevProps.currentKeys[prevProps.currentKeys.length - 1]

    if (((currentKeys.length > 1) || (prevProps.currentKeys.includes(currentKey) && currentKeys.length === 1)) && !retrigger) {
      // if retrigger mode is off, then we don't want to retrigger the envelope when we receive 
      // new key events, we just want to continue the envelope from where it left off
    } else if (currentKeys.length > 0 && currentKey !== prevKey) {
      this.triggerEnvelope(prevProps)
    }  else if (currentKey !== prevKey && currentKey === undefined) {
      this.releaseEnvelope()
    }
  }

  triggerEnvelope (prevProps) {
    const {
      attackTime, 
      decayTime,
    } = this.props.moduleParameter

    this.setState({
      attackStageEnd: this.audioContext.currentTime + attackTime, 
      decayStageEnd: this.audioContext.currentTime + attackTime + decayTime, 
      sustainStageEnd: null,
      releaseStageEnd: null
    })
    this.resetAtValue()
    this.scheduleAttackStage()
    this.scheduleDecayStage()
  }

  releaseEnvelope () {
    this.setState({ 
      attackStageEnd: null, 
      decayStageEnd: null, 
      releaseStageEnd: this.audioContext.currentTime + this.props.moduleParameter.releaseTime, 
      sustainStageEnd: this.audioContext.currentTime 
    })
    this.resetAtValue()
    this.scheduleReleaseStage()
  }

  getValueToAttackTo () {
    const { moduleParameter } = this.props
    const { range, baseValue, envelopeAmount } = moduleParameter

    return ((range[1] - baseValue) * envelopeAmount) + baseValue
  }

  getValueToDecayTo () {
    const { moduleParameter } = this.props
    const { sustainLevel, baseValue } = moduleParameter

    return ((this.getValueToAttackTo() - baseValue) * sustainLevel) + baseValue
  }

  resetToBaseValue () {
    this.cancelScheduledValues(0)
    this.updateAudioParam(this.param.baseValue)
  }

  resetAtValue () {
    this.cancelScheduledValues(0)
    this.updateAudioParam(this.param.value)
  }

  scheduleAttackStage () {
    const valueToAttackTo = this.getValueToAttackTo()
    const { attackTime, envelopeResponseType } = this.props.moduleParameter
    
    this.updateAudioParam(
      valueToAttackTo,
      {
        slopeType: envelopeResponseType,
        startValue: this.param.value,
        stageLength: attackTime,
        startTime: this.audioContext.currentTime
      }
    )
  }

  scheduleDecayStage () {
    const valueToAttackTo = this.getValueToAttackTo()
    const valueToDecayTo = this.getValueToDecayTo()
    const { attackTime, decayTime, envelopeResponseType } = this.props.moduleParameter

    this.updateAudioParam(
      valueToDecayTo, 
      { 
        slopeType: envelopeResponseType,
        startValue: valueToAttackTo,
        stageLength: decayTime,
        startTime: this.audioContext.currentTime + attackTime
      }
    )
  }

  scheduleReleaseStage () {
    const { baseValue, releaseTime, envelopeResponseType } = this.props.moduleParameter
    
    this.updateAudioParam(
      baseValue, 
      { 
        slopeType: envelopeResponseType,
        startValue: this.param.value,
        stageLength: releaseTime,
        startTime: this.audioContext.currentTime
      }
    )
  }

  

  cancelScheduledValues (atTime = this.audioContext.currentTime) {
    this.param.cancelScheduledValues(atTime)
  }

  updateAudioParam (newValue, options = {}) {
    if (newValue === 0) {
      newValue = 0.0001
    }

    const stageEndsAt = options.startTime + options.stageLength

    switch (options.slopeType) {
      case 'exponential': {
        this.param.exponentialRampToValueAtTime(newValue, stageEndsAt)
        break
      }
      case 'linear': {
        this.param.linearRampToValueAtTime(newValue, stageEndsAt)
        break
      }
      case 'logarithmic': {
        const slope = makeLogarithmicSlope(options.startValue, newValue)
        this.param.setValueCurveAtTime(slope, options.startTime, options.stageLength)
        break
      }
      default: {
        this.param.setValueAtTime(newValue, this.audioContext.currentTime)
        break
      }
    }
  }

  
  render () {
    return (
      null
    )
  }
}