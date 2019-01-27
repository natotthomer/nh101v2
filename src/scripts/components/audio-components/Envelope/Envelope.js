import React from 'react'

import { makeLogarithmicSlope, calculateAttackFrequency, calculateSustainValue } from '../../../utils'


export default class Envelope extends React.Component {
  constructor (props) {
    super(props)

    this.param = this.props.param
    this.audioContext = this.props.audioContext
    
    this.triggerEnvelope = this.triggerEnvelope.bind(this)
    this.recalibrateEnvelope = this.recalibrateEnvelope.bind(this)
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
      sustainStageEnd: null,
      triggered: false
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { currentKeys, parameterValues } = this.props
    const currentKey = currentKeys[currentKeys.length - 1]
    const prevKeys = prevProps.currentKeys
    const prevKey = prevProps.currentKeys[prevProps.currentKeys.length - 1]

    // condition declaration
    const prevKeysAndCurrentKeysAreNotTheSame = !(currentKeys.every((key, idx) => key === prevKeys[idx]) && currentKeys.length === prevKeys.length)
    const firstNote = currentKey !== prevKey && [undefined, null].includes(prevKey)
    console.log('firstNote', firstNote)
    console.log(prevKeysAndCurrentKeysAreNotTheSame)
    console.log(prevKeys, currentKeys)
    const hasEnvelopeBeenTriggered = ((prevKeysAndCurrentKeysAreNotTheSame && parameterValues.envelopeRetrigger) || firstNote ) && currentKeys.length > 0
    const hasKeyReleased = currentKey !== prevKey && [undefined, null].includes(currentKey)
    
    const hasParameterValuesChanged = Object.keys(prevProps.parameterValues).some(key => prevProps.parameterValues[key] !== this.props.parameterValues[key])

    
    if (hasEnvelopeBeenTriggered && !this.state.triggered) {
      this.setState({ triggered: true })
      this.triggerEnvelope()
    } else if (hasKeyReleased && this.state.triggered) {
      this.setState({ triggered: false })
      console.log('release')
      this.releaseEnvelope()
    } else if (hasParameterValuesChanged) {
      this.recalibrateEnvelope(prevProps)
    } 

    // if (((currentKeys.length > 1) || (prevProps.currentKeys.includes(currentKey) && currentKeys.length === 1)) && !this.props.parameterValues.envelopeRetrigger) {
    //   // if retrigger mode is off, then we don't want to retrigger the envelope when we receive 
    //   // new key events, we just want to continue the envelope from where it left off
    // } else if ((currentKeys.length > 0 && currentKey !== prevKey)) {
    //   console.log('first else if')
    //   this.triggerEnvelope()
    // }  else if (currentKey !== prevKey && currentKey === undefined) {
    //   console.log('second else if')
    //   this.releaseEnvelope()
    // } else if (parameterValues.baseValue !== prevProps.parameterValues.baseValue) {
    //   console.log('third')
    //   if (currentKeys.length > 0) {   
    //     console.log('third first')
    //     this.recalibrateEnvelope(prevProps)
    //   } else if (this.state.releaseStageEnd <= this.audioContext.currentTime) {
    //     console.log('third second')
    //     this.param.setValueAtTime(parameterValues.baseValue, this.audioContext.currentTime)
    //   }
    // } else if (this.audioContext.currentTime < this.state.attackStageEnd) {
    //   console.log('fourth') 
    //   const { gateStartTime } = this.props
    //   const { 
    //     attackTime, 
    //     decayTime, 
    //     sustainLevel,
    //     cutoffFrequency,
    //     envelopeAmount,
    //     envelopeResponseType
    //   } = this.props.parameterValues

    //   const timeSinceTrigger = this.audioContext.currentTime - gateStartTime
    //   const newRemainingAttackTime = attackTime - timeSinceTrigger
    //   const attackFrequency = this.getValueToAttackTo()
    //   const sustainFrequency = this.getValueToDecayTo()
      
    //   let attackStageEnd = this.audioContext.currentTime + newRemainingAttackTime
    //   let decayStageEnd = attackStageEnd + decayTime
      
    //   this.resetAtValue()
    //   this.updateAudioParam(this.param.value)

    //   if (attackStageEnd < this.audioContext.currentTime) {
    //     console.log('fourth inner')
    //     attackStageEnd = this.audioContext.currentTime
    //     decayStageEnd = this.audioContext.currentTime + decayTime
    //   }

    //   this.updateAudioParam(attackFrequency, {
    //     slopeType: envelopeResponseType,
    //     startValue: this.param.value,
    //     stageLength: attackTime,
    //     startTime: this.audioContext.currentTime
    //   })
    //   this.updateAudioParam(sustainFrequency, {
    //     slopeType: envelopeResponseType,
    //     startValue: attackFrequency,
    //     stageLength: decayTime,
    //     startTime: this.audioContext.currentTime
    //   })
      
    //   // this.updateFrequency(attackFrequency, attackStageEnd, 'linear')
    //   this.setState({ attackStageEnd, decayStageEnd })
    //   // this.updateFrequency(sustainFrequency, decayStageEnd, 'linear')
    // }
    
    // (parameterValues.envelopeAmount !== prevProps.parameterValues.envelopeAmount || 
    //   parameterValues.attackTime !== prevProps.parameterValues.attackTime ||
    //   parameterValues.decayTime !== prevProps.parameterValues.decayTime ||
    //   parameterValues.sustainLevel !== prevProps.parameterValues.sustainLevel ||
    //   parameterValues.releaseTime !== prevProps.parameterValues.releaseTime) {
        
    //   }
  }

  triggerEnvelope () {
    const {
      attackTime, 
      decayTime,
    } = this.props.parameterValues

    this.setState({
      attackStageEnd: this.audioContext.currentTime + attackTime, 
      decayStageEnd: this.audioContext.currentTime + attackTime + decayTime, 
      sustainStageEnd: null,
      releaseStageEnd: null
    })
    this.resetToBaseValue()
    this.scheduleAttackStage()
    this.scheduleDecayStage()
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

  cancelScheduledValues (atTime = this.audioContext.currentTime) {
    this.param.cancelScheduledValues(atTime)
  }

  releaseEnvelope () {
    this.setState({ 
      attackStageEnd: null, 
      decayStageEnd: null, 
      releaseStageEnd: this.audioContext.currentTime + this.props.parameterValues.releaseTime, 
      sustainStageEnd: this.audioContext.currentTime 
    })
    this.resetAtValue()
    this.scheduleReleaseStage()
  }

  getValueToAttackTo () {
    const { parameterValues } = this.props
    const { range, baseValue, envelopeAmount } = parameterValues

    return ((range[1] - baseValue) * envelopeAmount) + baseValue
  }

  getValueToDecayTo () {
    const { parameterValues } = this.props
    const { sustainLevel, baseValue } = parameterValues

    return ((this.getValueToAttackTo() - baseValue) * sustainLevel) + baseValue
  }

  resetToBaseValue () {
    this.cancelScheduledValues(0)
    this.updateAudioParam(this.props.parameterValues.baseValue)
  }

  resetAtValue () {
    this.cancelScheduledValues(0)
    this.updateAudioParam(this.param.value)
  }

  scheduleAttackStage () {
    const valueToAttackTo = this.getValueToAttackTo()
    const { attackTime, envelopeResponseType } = this.props.parameterValues
    
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
    const { attackTime, decayTime, envelopeResponseType } = this.props.parameterValues

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
    const { baseValue, releaseTime, envelopeResponseType } = this.props.parameterValues
    
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

  recalibrateEnvelope (prevProps) {
    if (this.props.gateStartTime === null && this.audioContext.currentTime < this.state.releaseStageEnd) {

    } else if (this.audioContext.currentTime < this.state.attackStageEnd) {
      
    }
  }
  
  render () {
    return null
  }
}



// Q. What do I want?

// A. I want a simple public API to initialize events and a private one that consists of the constituent parts to each type of event response

// Q. What does that, roughly, look like?

// A. - A series of helper methods:
//      - initiateTrigger
//      - initiateRelease
//      - scheduleAttackStage
//      - scheduleDecayStage
//      - scheduleReleaseStage
//      - recalibrateEnvelope
//      - 