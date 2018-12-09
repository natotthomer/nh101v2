import React from 'react'

export default class Envelope extends React.Component {
  constructor (props) {
    super(props)

    this.param = this.props.param
    
    this.updateAudioParam = this.updateAudioParam.bind(this)
    this.cancelScheduledValues = this.cancelScheduledValues.bind(this)
    this.triggerEnvelope = this.triggerEnvelope.bind(this)
    this.updateAttack = this.updateAttack.bind(this)
    this.updateDecay = this.updateDecay.bind(this)
    this.updateSustain = this.updateSustain.bind(this)
    this.updateRelease = this.updateRelease.bind(this)
    this.getValueToAttackTo = this.getValueToAttackTo.bind(this)
    this.getValueToSustainTo = this.getValueToSustainTo.bind(this)

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
    if (this.props.moduleParameter.attackTime !== prevProps.moduleParameter.attackTime) {
      this.updateAttack()
    } else if (this.props.moduleParameter.decayTime !== prevProps.moduleParameter.decayTime) {
      this.updateDecay()
    } else if (this.props.moduleParameter.sustainLevel !== prevProps.moduleParameter.sustainLevel) {
      this.updateSustain()
    } else if (this.props.moduleParameter.releaseTime !== prevProps.moduleParameter.releaseTime) {
      this.updateRelease()
    }
  }

  getValueToAttackTo () {
    const { moduleParameter } = this.props
    const { range, baseValue, envelopeAmount } = moduleParameter

    return ((range[1] - baseValue) * envelopeAmount) + baseValue
  }

  getValueToSustainTo () {
    const { moduleParameter } = this.props
    const { sustainLevel, baseValue } = moduleParameter

    return ((this.getValueToAttackTo() - baseValue) * sustainLevel) + baseValue
  }

  updateAttack () {
    const { triggerStartTime, audioContext, attackTime, decayTime } = this.props

    if (triggerStartTime && (audioContext.currentTime < this.state.attackStageEnd)) {
      const timeSinceTrigger = audioContext.currentTime - triggerStartTime
      const newRemainingAttackTime = attackTime - timeSinceTrigger
      
      let attackStageEnd = audioContext.currentTime + newRemainingAttackTime
      let decayStageEnd = attackStageEnd + decayTime
      
      this.cancelScheduledValues()
      this.updateAudioParam(this.param.value)
      if (attackStageEnd < audioContext.currentTime) {
        attackStageEnd = audioContext.currentTime
        decayStageEnd = audioContext.currentTime + decayTime
      }
      this.updateAudioParam(this.getValueToAttackTo(), attackStageEnd, 'linear')
      this.setState({ attackStageEnd, decayStageEnd })
      this.updateAudioParam(this.getValueToSustainTo(), decayStageEnd, 'linear')
    }
  }

  updateDecay () {
    const { triggerStartTime, audioContext, moduleParameter } = this.props
    const { decayTime } = moduleParameter

    if (triggerStartTime && audioContext.currentTime < this.state.attackStageEnd) {
      const decayStageEnd = this.state.attackStageEnd + decayTime
          
      this.param.cancelAndHoldAtTime(this.state.attackStageEnd)
      this.param.setValueAtTime(this.param.value, audioContext.currentTime)
      this.updateAudioParam(this.getValueToSustainTo(), decayStageEnd, 'linear')
      this.setState({ decayStageEnd })
    } else if (triggerStartTime && (audioContext.currentTime < this.state.decayStageEnd) && (audioContext.currentTime > this.state.attackStageEnd)) {
      const timeSinceAttackStageEnded = audioContext.currentTime - this.state.attackStageEnd
      const newRemainingDecayTime = decayTime - timeSinceAttackStageEnded

      let decayStageEnd = audioContext.currentTime + newRemainingDecayTime
      this.cancelScheduledValues()
      this.updateAudioParam(this.param.value)
          
      if (decayStageEnd < audioContext.currentTime) {
        decayStageEnd = audioContext.currentTime
      }

      this.updateAudioParam(this.getValueToSustainTo(), decayStageEnd, 'linear')
      this.setState({ decayStageEnd })
    }
  }

  updateSustain () {
    const { triggerStartTime, audioContext, decayTime } = this.props
    if (triggerStartTime && audioContext.currentTime < this.state.attackStageEnd) {
      const decayStageEnd = this.state.attackStageEnd + decayTime
          
      this.param.cancelAndHoldAtTime(this.state.attackStageEnd)
      this.param.setValueAtTime(this.param.value, audioContext.currentTime)
      this.updateAudioParam(this.getValueToSustainTo(), decayStageEnd, 'linear')
      this.setState({ decayStageEnd })
    } else if (triggerStartTime && audioContext.currentTime < this.state.decayStageEnd) {
      this.param.cancelScheduledValues(audioContext.currentTime)
      this.param.setValueAtTime(this.param.value, audioContext.currentTime)
      this.updateAudioParam(this.getValueToSustainTo(), this.state.decayStageEnd, 'linear')
    } else if (triggerStartTime) {
      this.updateAudioParam(this.getValueToSustainTo())
    }
  }

  updateRelease () {
    if (this.param.value > 0 && this.state.releaseStageEnd) {
      const { moduleParameter, audioContext } = this.props
      const { releaseTime, baseValue } = moduleParameter
      
      const timeSinceSustainStageEnded = audioContext.currentTime - this.state.sustainStageEnd
      const newRemainingReleaseTime = releaseTime - timeSinceSustainStageEnded

      let releaseStageEnd = audioContext.currentTime + newRemainingReleaseTime

      this.cancelScheduledValues()
      this.updateAudioParam(this.param.value)

      if (releaseStageEnd < audioContext.currentTime) {
        releaseStageEnd = audioContext.currentTime
      }
      
      this.updateAudioParam(baseValue, releaseStageEnd, 'linear')
      this.setState({ releaseStageEnd })
    }
  }

  triggerEnvelope (prevProps) {
    const { 
      audioContext, 
      currentKeys, 
      moduleParameter
    } = this.props

    const {
      attackTime, 
      decayTime,
      sustainLevel,
      releaseTime,
      baseValue,
      range,
      envelopeAmount
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
        attackStageEnd: audioContext.currentTime + attackTime, 
        decayStageEnd: audioContext.currentTime + attackTime + decayTime, 
        sustainStageEnd: null,
        releaseStageEnd: null
      })
      this.cancelScheduledValues()
      this.updateAudioParam(baseValue, audioContext.currentTime)
      this.updateAudioParam(this.getValueToAttackTo(), attackTime + audioContext.currentTime, 'linear')
      this.updateAudioParam(this.getValueToSustainTo(), decayTime + attackTime + audioContext.currentTime, 'linear')
    } else if (currentKey !== prevKey && currentKey === undefined) {
      // initiate Release stage
      this.cancelScheduledValues()
      this.updateAudioParam(this.param.value)
      this.updateAudioParam(baseValue, releaseTime + audioContext.currentTime, 'linear')
      this.setState({ attackStageEnd: null, decayStageEnd: null, releaseStageEnd: audioContext.currentTime + releaseTime, sustainStageEnd: audioContext.currentTime })
    }
  }

  cancelScheduledValues (atTime = this.props.audioContext.currentTime) {
    this.param.cancelScheduledValues(atTime)
  }

  updateAudioParam (newValue, atTime=this.props.audioContext.currentTime, slopeType=null) {
    switch (slopeType) {
      case 'exponential': {
        // Will break if `newValue` is 0 and slopeType is `exponential` (needs to
        // ANY number greater or lesser than 0.)
        this.param.exponentialRampToValueAtTime(newValue, atTime)
        break
      }
      case 'linear': {
        this.param.linearRampToValueAtTime(newValue, atTime)
        break
      }
      default: {
        this.param.setValueAtTime(newValue, atTime)
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