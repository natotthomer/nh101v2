import React from 'react'

export default class VCA extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            time: 0.0,
            attackStageEnd: null,
            decayStageEnd: null,
            releaseStageEnd: null,
            sustainStageEnd: null
        }

        this.amplifier = this.props.audioContext.createGain()
        this.amplifier.gain.value = 0

        this.updateGain = this.updateGain.bind(this)
        this.cancelScheduledValues = this.cancelScheduledValues.bind(this)
        this.triggerEnvelope = this.triggerEnvelope.bind(this)
        this.updateAttack = this.updateAttack.bind(this)
        this.updateDecay = this.updateDecay.bind(this)
        this.updateSustain = this.updateSustain.bind(this)
        this.updateRelease = this.updateRelease.bind(this)
        this.loop = this.loop.bind(this)
    }

    componentDidMount () {
        this._frameId = window.requestAnimationFrame(this.loop);
    }

    componentDidUpdate (prevProps, prevState) {
        this.triggerEnvelope(prevProps)
        // These are checking whether the values are changing while the envelope is in 
        // process, and therefore whether the current rates of change need to change
        if (this.props.amplifierAttackTime !== prevProps.amplifierAttackTime) {
            this.updateAttack()
        } else if (this.props.amplifierDecayTime !== prevProps.amplifierDecayTime) {
            this.updateDecay()
        } else if (this.props.amplifierSustainLevel !== prevProps.amplifierSustainLevel) {
            this.updateSustain()
        } else if (this.props.amplifierReleaseTime !== prevProps.amplifierReleaseTime) {
            this.updateRelease()
        }
    }

    loop () {
        this.setState({ time: this.props.audioContext.currentTime })

        this._frameId = window.requestAnimationFrame(this.loop);
    }

    updateAttack () {
        const { triggerStartTime, audioContext, amplifierAttackTime, amplifierDecayTime, amplifierSustainLevel } = this.props

        if (triggerStartTime && (audioContext.currentTime < this.state.attackStageEnd)) {
            const timeSinceTrigger = audioContext.currentTime - triggerStartTime
            const newRemainingAttackTime = amplifierAttackTime - timeSinceTrigger
            
            let attackStageEnd = audioContext.currentTime + newRemainingAttackTime
            let decayStageEnd = attackStageEnd + amplifierDecayTime
            
            this.cancelScheduledValues()
            this.updateGain(this.amplifier.gain.value)
            if (attackStageEnd < audioContext.currentTime) {
                attackStageEnd = audioContext.currentTime
                decayStageEnd = audioContext.currentTime + amplifierDecayTime
            }
            this.updateGain(1, attackStageEnd, 'linear')
            this.setState({ attackStageEnd, decayStageEnd })
            this.updateGain(amplifierSustainLevel, decayStageEnd, 'linear')
        }
    }

    updateDecay () {
        const { triggerStartTime, audioContext, amplifierDecayTime, amplifierSustainLevel } = this.props

        if (triggerStartTime && audioContext.currentTime < this.state.attackStageEnd) {
            const decayStageEnd = this.state.attackStageEnd + amplifierDecayTime
            
            this.amplifier.gain.cancelAndHoldAtTime(this.state.attackStageEnd)
            this.amplifier.gain.setValueAtTime(this.amplifier.gain.value, audioContext.currentTime)
            this.updateGain(amplifierSustainLevel, decayStageEnd, 'linear')
            this.setState({ decayStageEnd })
        } else if (triggerStartTime && (audioContext.currentTime < this.state.decayStageEnd) && (audioContext.currentTime > this.state.attackStageEnd)) {
            const timeSinceAttackStageEnded = audioContext.currentTime - this.state.attackStageEnd
            const newRemainingDecayTime = amplifierDecayTime - timeSinceAttackStageEnded

            let decayStageEnd = audioContext.currentTime + newRemainingDecayTime
            this.cancelScheduledValues()
            this.updateGain(this.amplifier.gain.value)
            
            if (decayStageEnd < audioContext.currentTime) {
                decayStageEnd = audioContext.currentTime
            }

            this.updateGain(amplifierSustainLevel, decayStageEnd, 'linear')
            this.setState({ decayStageEnd })
        }
    }

    updateSustain () {
        const { triggerStartTime, audioContext, amplifierSustainLevel, amplifierDecayTime } = this.props
        if (triggerStartTime && audioContext.currentTime < this.state.attackStageEnd) {
            const decayStageEnd = this.state.attackStageEnd + amplifierDecayTime
            
            this.amplifier.gain.cancelAndHoldAtTime(this.state.attackStageEnd)
            this.amplifier.gain.setValueAtTime(this.amplifier.gain.value, audioContext.currentTime)
            this.updateGain(amplifierSustainLevel, decayStageEnd, 'linear')
            this.setState({ decayStageEnd })
        } else if (triggerStartTime && audioContext.currentTime < this.state.decayStageEnd) {
            this.amplifier.gain.cancelScheduledValues(audioContext.currentTime)
            this.amplifier.gain.setValueAtTime(this.amplifier.gain.value, audioContext.currentTime)
            this.updateGain(amplifierSustainLevel, this.state.decayStageEnd, 'linear')
        } else if (triggerStartTime) {
            this.updateGain(amplifierSustainLevel)
        }
    }

    updateRelease () {
        if (this.amplifier.gain.value > 0 && this.state.releaseStageEnd) {
            const { amplifierReleaseTime, audioContext } = this.props
            
            const timeSinceSustainStageEnded = audioContext.currentTime - this.state.sustainStageEnd
            const newRemainingReleaseTime = amplifierReleaseTime - timeSinceSustainStageEnded

            let releaseStageEnd = audioContext.currentTime + newRemainingReleaseTime

            this.cancelScheduledValues()
            this.updateGain(this.amplifier.gain.value)

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
            amplifierAttackTime, 
            amplifierDecayTime,
            amplifierSustainLevel,
            amplifierReleaseTime
        } = this.props
        const currentKey = currentKeys[currentKeys.length - 1]
        const prevKey = prevProps.currentKeys[prevProps.currentKeys.length - 1]
        
        if (((currentKeys.length > 1) || (prevProps.currentKeys.includes(currentKey) && currentKeys.length === 1)) && !this.props.retrigger) {
            // if retrigger mode is off, then we don't want to retrigger the envelope when we receive 
            // new key events, we just want to continue the envelope from where it left off
        } else if (currentKeys.length > 0 && currentKey !== prevKey) {
            // retrigger envelope on receiving new key press or removing a key with more keys 
            // still engaged
            this.setState({
                attackStageEnd: audioContext.currentTime + amplifierAttackTime, 
                decayStageEnd: audioContext.currentTime + amplifierAttackTime + amplifierDecayTime, 
                sustainStageEnd: null,
                releaseStageEnd: null
            })
            this.cancelScheduledValues()
            this.updateGain(0, audioContext.currentTime)
            this.updateGain(1, amplifierAttackTime + audioContext.currentTime, 'linear')
            this.updateGain(amplifierSustainLevel, amplifierDecayTime + amplifierAttackTime + audioContext.currentTime, 'linear')
        } else if (currentKey !== prevKey && currentKey === undefined) {
            // initiate Release stage
            this.cancelScheduledValues()
            this.updateGain(this.amplifier.gain.value)
            this.updateGain(0, this.props.amplifierReleaseTime + audioContext.currentTime, 'linear')
            this.setState({ attackStageEnd: null, decayStageEnd: null, releaseStageEnd: audioContext.currentTime + amplifierReleaseTime, sustainStageEnd: audioContext.currentTime })
        }
    }

    cancelScheduledValues (atTime = this.props.audioContext.currentTime) {
        this.amplifier.gain.cancelScheduledValues(atTime)
    }
    
    updateGain(newValue, atTime=this.props.audioContext.currentTime, slopeType=null) {
        switch (slopeType) {
            case 'exponential': {
                // Will break if `newValue` is 0 and slopeType is `exponential` (needs to
                // ANY number greater or lesser than 0.)
                this.amplifier.gain.exponentialRampToValueAtTime(newValue, atTime)
                break
            }
            case 'linear': {
                this.amplifier.gain.linearRampToValueAtTime(newValue, atTime)
                break
            }
            default: {
                this.amplifier.gain.setValueAtTime(newValue, atTime)
                break
            }
        }
    }
    
    render () {
        return null
    }
}