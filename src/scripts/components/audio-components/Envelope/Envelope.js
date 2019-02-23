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
    this.setValueAtTime = this.setValueAtTime.bind(this)

    this.state = {
      time: 0.0,
      attackStageEnd: null,
      decayStageEnd: null,
      releaseStageEnd: null,
      sustainStageEnd: null,
      triggered: false
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (Object.keys(nextProps).every(key => nextProps[key] === this.props[key]) && Object.keys(nextState).every(key => nextState[key] === this.state[key])) {
      return false
    }

    return true
  }

  componentDidUpdate (prevProps, prevState) {
    const { currentKeys, parameterValues } = this.props
    const currentKey = currentKeys[currentKeys.length - 1]
    const prevKeys = prevProps.currentKeys
    const prevKey = prevProps.currentKeys[prevProps.currentKeys.length - 1]

    // condition declaration
    const prevKeysAndCurrentKeysAreNotTheSame = !(currentKeys.every((key, idx) => key === prevKeys[idx]) && currentKeys.length === prevKeys.length)
    const firstNote = currentKey !== prevKey && [undefined, null].includes(prevKey)
    const hasEnvelopeBeenTriggered = ((prevKeysAndCurrentKeysAreNotTheSame && parameterValues.envelopeRetrigger) || firstNote ) && currentKeys.length > 0
    const hasKeyReleased = currentKey !== prevKey && [undefined, null].includes(currentKey)
    
    const hasParameterValuesChanged = Object.keys(prevProps.parameterValues).some(key => prevProps.parameterValues[key] !== this.props.parameterValues[key])

    
    if (hasEnvelopeBeenTriggered) {
      this.triggerEnvelope();
    } else if (hasKeyReleased) {
      this.releaseEnvelope();
    } else if (hasParameterValuesChanged) {
      this.recalibrateEnvelope(prevProps);
    } 
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

  updateAudioParam (newValue, options = {}, blah=undefined) {
    if (newValue === 0) {
      newValue = 0.0001;
    }
    
    const stageEndsAt = options.startTime + options.stageLength;

    switch (options.slopeType) {
      case 'exponential': {
        this.param.exponentialRampToValueAtTime(newValue, stageEndsAt);
        break;
      }
      case 'linear': {
        this.param.linearRampToValueAtTime(newValue, stageEndsAt);
        break;
      }
      case 'logarithmic': {
        const slope = makeLogarithmicSlope(options.startValue, newValue);
        this.param.setValueCurveAtTime(slope, options.startTime, options.stageLength);
        break;
      }
      default: {
        this.param.setValueAtTime(newValue, options.startTime || this.audioContext.currentTime);
        break;
      }
    }
  }

  setValueAtTime(newValue, atTime) {
    this.param.setValue(newValue, atTime || this.audioContext.currentTime)
  }

  cancelScheduledValues (atTime = 0) {
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

  resetAtValue (atTime = 0) {
    this.cancelScheduledValues(atTime);
    this.updateAudioParam(this.param.value);
  }

  scheduleAttackStage (gateStartTime) {
    const stageLength = gateStartTime ? this.audioContext.currentTime - gateStartTime : attackTime
    const valueToAttackTo = this.getValueToAttackTo();
    const { attackTime, envelopeResponseType } = this.props.parameterValues;
    
    this.updateAudioParam(
      valueToAttackTo,
      {
        slopeType: envelopeResponseType,
        startValue: this.param.value,
        stageLength: attackTime,
        startTime: this.audioContext.currentTime
      }
    );
  }

  scheduleDecayStage () {
    const valueToAttackTo = this.getValueToAttackTo();
    const valueToDecayTo = this.getValueToDecayTo();
    const { attackTime, decayTime, envelopeResponseType } = this.props.parameterValues;
    
    this.updateAudioParam(
      valueToDecayTo,
      { 
        slopeType: envelopeResponseType,
        startValue: valueToAttackTo,
        stageLength: decayTime,
        startTime: this.state.attackStageEnd ? this.state.attackStageEnd : this.audioContext.currentTime + attackTime
      }
    );
  }

  scheduleReleaseStage () {
    const { baseValue, releaseTime, envelopeResponseType } = this.props.parameterValues;
    
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
      if (this.props.parameterValues.attackTime !== prevProps.parameterValues.attackTime) {
        this.resetAtValue();  
        this.scheduleAttackStage();
        this.scheduleDecayStage();
      } else if (this.props.parameterValues.decayTime !== prevProps.parameterValues.decayTime) {
        this.param.cancelAndHoldAtTime(this.state.attackStageEnd)
        this.scheduleDecayStage();
      } else if (this.props.parameterValues.sustainLevel !== prevProps.parameterValues.sustainLevel) {
        this.param.cancelAndHoldAtTime(this.state.attackStageEnd)
        this.scheduleDecayStage();
      } else if (this.props.parameterValues.envelopeAmount !== prevProps.parameterValues.envelopeAmount) {
        this.param.cancelScheduledValues(0)
        this.param.setValueAtTime(this.param.value, this.audioContext.currentTime);
        this.scheduleAttackStage(this.props.gateStartTime);
        this.scheduleDecayStage();
      } else if (this.props.parameterValues.baseValue !== prevProps.parameterValues.baseValue) {
        this.param.cancelScheduledValues(0)
        this.param.setValueAtTime(this.param.value, this.audioContext.currentTime);
        this.scheduleAttackStage(this.props.gateStartTime);
        this.scheduleDecayStage();
      }
    } else if ((this.audioContext.currentTime >= this.state.attackStageEnd && this.audioContext.currentTime < this.state.decayStageEnd) && (this.props.parameterValues.attackTime !== prevProps.parameterValues.attackTime || this.props.parameterValues.envelopeResponseType !== prevProps.parameterValues.envelopeResponseType)) {
      this.resetAtValue();
      this.scheduleDecayStage();
    }
  }
  
  render () {
    return null
  }
}