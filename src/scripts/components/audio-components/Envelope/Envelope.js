import React from 'react'

import { makeLogarithmicSlope } from '../../../utils'


export default class Envelope extends React.Component {
  constructor (props) {
    super(props)

    this.param = this.props.param
    this.audioContext = this.props.audioContext
    
    this.updateAudioParam = this.updateAudioParam.bind(this)
    this.cancelScheduledValues = this.cancelScheduledValues.bind(this)
    this.triggerEnvelope = this.triggerEnvelope.bind(this)
    // this.updateAttack = this.updateAttack.bind(this)
    // this.updateDecay = this.updateDecay.bind(this)
    // this.updateSustain = this.updateSustain.bind(this)
    // this.updateRelease = this.updateRelease.bind(this)
    this.getValueToAttackTo = this.getValueToAttackTo.bind(this)
    this.getValueToDecayTo = this.getValueToDecayTo.bind(this)
    this.resetAtValue = this.resetAtValue.bind(this)
    this.scheduleAttackStage = this.scheduleAttackStage.bind(this)
    this.scheduleDecayStage = this.scheduleDecayStage.bind(this)
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
    this.triggerEnvelope(prevProps)
    // These are checking whether the values are changing while the envelope is in 
    // process, and therefore whether the current rates of change need to change
    // if (this.props.moduleParameter.attackTime !== prevProps.moduleParameter.attackTime) {
    //   this.updateAttack()
    // } else if (this.props.moduleParameter.decayTime !== prevProps.moduleParameter.decayTime) {
    //   this.updateDecay()
    // } else if (this.props.moduleParameter.sustainLevel !== prevProps.moduleParameter.sustainLevel) {
    //   this.updateSustain()
    // } else if (this.props.moduleParameter.releaseTime !== prevProps.moduleParameter.releaseTime) {
    //   this.updateRelease()
    // }
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

  // updateAttack () {
  //   const { gateStartTime, attackTime, decayTime, envelopeResponseType } = this.props

  //   if (gateStartTime && (this.audioContext.currentTime < this.state.attackStageEnd)) {
  //     const timeSinceTrigger = this.audioContext.currentTime - gateStartTime
  //     const newRemainingAttackTime = attackTime - timeSinceTrigger
      
  //     let attackStageEnd = this.audioContext.currentTime + newRemainingAttackTime
  //     let decayStageEnd = attackStageEnd + decayTime
      
  //     this.cancelScheduledValues()
  //     this.updateAudioParam(this.param.value)
  //     if (attackStageEnd < this.audioContext.currentTime) {
  //       attackStageEnd = this.audioContext.currentTime
  //       decayStageEnd = this.audioContext.currentTime + decayTime
  //     }
  //     this.updateAudioParam(
  //       this.getValueToAttackTo(), 
  //       { stageEndsAt: attackStageEnd, slopeType: envelopeResponseType })
  //     this.setState({ attackStageEnd, decayStageEnd })
  //     this.updateAudioParam(
  //       this.getValueToDecayTo(), 
  //       { stageEndsAt: decayStageEnd, slopeType: envelopeResponseType })
  //   }
  // }

  // updateDecay () {
  //   const { gateStartTime, moduleParameter, envelopeResponseType } = this.props
  //   const { decayTime } = moduleParameter

  //   if (gateStartTime && this.audioContext.currentTime < this.state.attackStageEnd) {
  //     const decayStageEnd = this.state.attackStageEnd + decayTime
          
  //     this.param.cancelAndHoldAtTime(this.state.attackStageEnd)
  //     this.param.setValueAtTime(this.param.value, this.audioContext.currentTime)
  //     this.updateAudioParam(this.getValueToDecayTo(), {
  //       stageEndsAt: decayStageEnd, 
  //       slopeType: envelopeResponseType 
  //     })
  //     this.setState({ decayStageEnd })
  //   } else if (gateStartTime && (this.audioContext.currentTime < this.state.decayStageEnd) && (this.audioContext.currentTime > this.state.attackStageEnd)) {
  //     const timeSinceAttackStageEnded = this.audioContext.currentTime - this.state.attackStageEnd
  //     const newRemainingDecayTime = decayTime - timeSinceAttackStageEnded

  //     let decayStageEnd = this.audioContext.currentTime + newRemainingDecayTime
  //     this.cancelScheduledValues()
  //     this.updateAudioParam(this.param.value)
          
  //     if (decayStageEnd < this.audioContext.currentTime) {
  //       decayStageEnd = this.audioContext.currentTime
  //     }

  //     this.updateAudioParam(this.getValueToDecayTo(), { 
  //       stageEndsAt: decayStageEnd, 
  //       slopeType: envelopeResponseType 
  //     })
  //     this.setState({ decayStageEnd })
  //   }
  // }

  // updateSustain () {
  //   const { gateStartTime, decayTime, envelopeResponseType } = this.props
  //   if (gateStartTime && this.audioContext.currentTime < this.state.attackStageEnd) {
  //     const decayStageEnd = this.state.attackStageEnd + decayTime
          
  //     this.param.cancelAndHoldAtTime(this.state.attackStageEnd)
  //     this.param.setValueAtTime(this.param.value, this.audioContext.currentTime)
  //     this.updateAudioParam(this.getValueToDecayTo(), { 
  //       stageEndsAt: decayStageEnd, 
  //       slopeType: envelopeResponseType 
  //     })
  //     this.setState({ decayStageEnd })
  //   } else if (gateStartTime && this.audioContext.currentTime < this.state.decayStageEnd) {
  //     this.param.cancelScheduledValues(this.audioContext.currentTime)
  //     this.param.setValueAtTime(this.param.value, this.audioContext.currentTime)
  //     this.updateAudioParam(this.getValueToDecayTo(), { 
  //       stageEndsAt: this.state.decayStageEnd, 
  //       slopeType: envelopeResponseType 
  //     })
  //   } else if (gateStartTime) {
  //     this.updateAudioParam(this.getValueToDecayTo())
  //   }
  // }

  // updateRelease () {
  //   if (this.param.value > 0 && this.state.releaseStageEnd) {
  //     console.log(this.param)
  //     console.log(this.param.value, this.state.releaseStageEnd)
  //     const { moduleParameter } = this.props
  //     const { releaseTime, baseValue } = moduleParameter
      
  //     const timeSinceSustainStageEnded = this.audioContext.currentTime - this.state.sustainStageEnd
  //     const newRemainingReleaseTime = releaseTime - timeSinceSustainStageEnded

  //     let releaseStageEnd = this.audioContext.currentTime + newRemainingReleaseTime

  //     this.resetAtValue()

  //     if (releaseStageEnd < this.audioContext.currentTime) {
  //       releaseStageEnd = this.audioContext.currentTime
  //     }
      
  //     this.scheduleReleaseStage()
  //     this.setState({ releaseStageEnd })
  //   }
  // }

  // recalibrateEnvelope () {
  //   if (this.props.currentKeys.length > 0) {
  //     const { gateStartTime, attackTime, decayTime, moduleParameter } = this.props
  //     const { attackStageEnd, decayStageEnd, releaseStageEnd, sustainStageEnd } = this.state
  //     const timeSinceTrigger = this.audioContext.currentTime - gateStartTime

  //     if (attackStageEnd > this.audioContext.currentTime) {
  //       const newRemainingAttackTime = attackTime - timeSinceTrigger

  //       let attackStageEnd = this.audioContext.currentTime + newRemainingAttackTime
  //       let decayStageEnd = attackStageEnd + decayTime
        
  //       this.cancelScheduledValues()
  //       this.updateAudioParam(moduleParameter.baseValue)
  //       if (attackStageEnd < this.audioContext.currentTime) {
  //         attackStageEnd = this.audioContext.currentTime
  //         decayStageEnd = this.audioContext.currentTime + decayTime
  //       }
  //       this.updateAudioParam(this.getValueToAttackTo(), { 
  //         stageEndsAt: attackStageEnd, 
  //         slopeType: 'linear' 
  //       })
  //       this.setState({ attackStageEnd, decayStageEnd })
  //       this.updateAudioParam(this.getValueToDecayTo(), { 
  //         stageEndsAt: decayStageEnd, 
  //         slopeType: 'linear' 
  //       })
  //     }
  //   }
  // }

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

  triggerEnvelope (prevProps) {
    const { 
      currentKeys, 
      moduleParameter
    } = this.props

    const {
      attackTime, 
      decayTime,
      releaseTime,
    } = moduleParameter
    const currentKey = currentKeys[currentKeys.length - 1]
    const prevKey = prevProps.currentKeys[prevProps.currentKeys.length - 1]
    
    if (((currentKeys.length > 1) || (prevProps.currentKeys.includes(currentKey) && currentKeys.length === 1)) && !this.props.retrigger) {
      // if retrigger mode is off, then we don't want to retrigger the envelope when we receive 
      // new key events, we just want to continue the envelope from where it left off
    } else if (currentKeys.length > 0 && currentKey !== prevKey) {
      // retrigger envelope on receiving new key press or removing a key with more keys 
      // still engaged
      this.setState({
        attackStageEnd: this.audioContext.currentTime + attackTime, 
        decayStageEnd: this.audioContext.currentTime + attackTime + decayTime, 
        sustainStageEnd: null,
        releaseStageEnd: null
      })
      this.resetAtValue()
      this.scheduleAttackStage()
      this.scheduleDecayStage()
      
    } else if (currentKey !== prevKey && currentKey === undefined) {
      // initiate Release stage
      this.resetAtValue()
      this.scheduleReleaseStage()
      this.setState({ 
        attackStageEnd: null, 
        decayStageEnd: null, 
        releaseStageEnd: this.audioContext.currentTime + releaseTime, 
        sustainStageEnd: this.audioContext.currentTime })
    }
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