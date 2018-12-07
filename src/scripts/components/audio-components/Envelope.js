import React from 'react'

export default class Envelope extends React.Component {
  constructor (props) {
    super(props)

    this.param = this.props.param
    
    this.updateGain = this.updateGain.bind(this)
    this.cancelScheduledValues = this.cancelScheduledValues.bind(this)
    this.triggerEnvelope = this.triggerEnvelope.bind(this)
    this.updateAttack = this.updateAttack.bind(this)
    this.updateDecay = this.updateDecay.bind(this)
    this.updateSustain = this.updateSustain.bind(this)
    this.updateRelease = this.updateRelease.bind(this)

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
    if (this.props.attackTime !== prevProps.attackTime) {
        this.updateAttack()
    } else if (this.props.decayTime !== prevProps.decayTime) {
        this.updateDecay()
    } else if (this.props.sustainLevel !== prevProps.sustainLevel) {
        this.updateSustain()
    } else if (this.props.releaseTime !== prevProps.releaseTime) {
        this.updateRelease()
    }
  }

  updateAttack () {
    const { triggerStartTime, audioContext, attackTime, decayTime, sustainLevel } = this.props

    if (triggerStartTime && (audioContext.currentTime < this.state.attackStageEnd)) {
        const timeSinceTrigger = audioContext.currentTime - triggerStartTime
        const newRemainingAttackTime = attackTime - timeSinceTrigger
        
        let attackStageEnd = audioContext.currentTime + newRemainingAttackTime
        let decayStageEnd = attackStageEnd + decayTime
        
        this.cancelScheduledValues()
        this.updateGain(this.param.value)
        if (attackStageEnd < audioContext.currentTime) {
            attackStageEnd = audioContext.currentTime
            decayStageEnd = audioContext.currentTime + decayTime
        }
        this.updateGain(1, attackStageEnd, 'linear')
        this.setState({ attackStageEnd, decayStageEnd })
        this.updateGain(sustainLevel, decayStageEnd, 'linear')
    }
  }

  updateDecay () {
    const { triggerStartTime, audioContext, decayTime, sustainLevel } = this.props

    if (triggerStartTime && audioContext.currentTime < this.state.attackStageEnd) {
      const decayStageEnd = this.state.attackStageEnd + decayTime
          
      this.param.cancelAndHoldAtTime(this.state.attackStageEnd)
      this.param.setValueAtTime(this.param.value, audioContext.currentTime)
      this.updateGain(sustainLevel, decayStageEnd, 'linear')
      this.setState({ decayStageEnd })
    } else if (triggerStartTime && (audioContext.currentTime < this.state.decayStageEnd) && (audioContext.currentTime > this.state.attackStageEnd)) {
      const timeSinceAttackStageEnded = audioContext.currentTime - this.state.attackStageEnd
      const newRemainingDecayTime = decayTime - timeSinceAttackStageEnded

      let decayStageEnd = audioContext.currentTime + newRemainingDecayTime
      this.cancelScheduledValues()
      this.updateGain(this.param.value)
          
      if (decayStageEnd < audioContext.currentTime) {
        decayStageEnd = audioContext.currentTime
      }

      this.updateGain(sustainLevel, decayStageEnd, 'linear')
      this.setState({ decayStageEnd })
    }
  }

  updateSustain () {
    const { triggerStartTime, audioContext, sustainLevel, decayTime } = this.props
    if (triggerStartTime && audioContext.currentTime < this.state.attackStageEnd) {
      const decayStageEnd = this.state.attackStageEnd + decayTime
          
      this.param.cancelAndHoldAtTime(this.state.attackStageEnd)
      this.param.setValueAtTime(this.param.value, audioContext.currentTime)
      this.updateGain(sustainLevel, decayStageEnd, 'linear')
      this.setState({ decayStageEnd })
    } else if (triggerStartTime && audioContext.currentTime < this.state.decayStageEnd) {
      this.param.cancelScheduledValues(audioContext.currentTime)
      this.param.setValueAtTime(this.param.value, audioContext.currentTime)
      this.updateGain(sustainLevel, this.state.decayStageEnd, 'linear')
    } else if (triggerStartTime) {
      this.updateGain(sustainLevel)
    }
  }

  updateRelease () {
      if (this.param.value > 0 && this.state.releaseStageEnd) {
          const { releaseTime, audioContext } = this.props
          
          const timeSinceSustainStageEnded = audioContext.currentTime - this.state.sustainStageEnd
          const newRemainingReleaseTime = releaseTime - timeSinceSustainStageEnded

          let releaseStageEnd = audioContext.currentTime + newRemainingReleaseTime

          this.cancelScheduledValues()
          this.updateGain(this.param.value)

          if (releaseStageEnd < audioContext.currentTime) {
              releaseStageEnd = audioContext.currentTime
          }
          
          this.updateGain(0, releaseStageEnd, 'linear')
          this.setState({ releaseStageEnd })
      }
  }

  triggerEnvelope (prevProps) {
    const { 
      audioContext, 
      currentKeys, 
      synth
    } = this.props

    const {
      attackTime, 
      decayTime,
      sustainLevel,
      releaseTime
    } = synth.vca
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
      this.updateGain(0, audioContext.currentTime)
      this.updateGain(1, attackTime + audioContext.currentTime, 'linear')
      this.updateGain(sustainLevel, decayTime + attackTime + audioContext.currentTime, 'linear')
    } else if (currentKey !== prevKey && currentKey === undefined) {
      // initiate Release stage
      this.cancelScheduledValues()
      this.updateGain(this.param.value)
      this.updateGain(0, releaseTime + audioContext.currentTime, 'linear')
      this.setState({ attackStageEnd: null, decayStageEnd: null, releaseStageEnd: audioContext.currentTime + releaseTime, sustainStageEnd: audioContext.currentTime })
    }
  }

  cancelScheduledValues (atTime = this.props.audioContext.currentTime) {
      this.param.cancelScheduledValues(atTime)
  }

  updateGain (newValue, atTime=this.props.audioContext.currentTime, slopeType=null) {
    console.log('value', newValue)
    console.log('time', atTime)
    console.log(this.props)
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
    console.log(this.props)
    return (
      <div>Envelope</div>
    )
  }
}