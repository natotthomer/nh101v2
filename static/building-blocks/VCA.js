import React from 'react'

export default class VCA extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            time: 0.0
        }

        this.amplifier = this.props.audioContext.createGain()
        this.amplifier.gain.value = 0

        this.updateGain = this.updateGain.bind(this)
        this.triggerEnvelope = this.triggerEnvelope.bind(this)
        this.updateAttack = this.updateAttack.bind(this)
        this.updateDecay = this.updateDecay.bind(this)
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
        }
    }

    loop () {
        this.setState({ time: this.props.audioContext.currentTime })

        this._frameId = window.requestAnimationFrame(this.loop);
    }

    updateAttack () {
        if (this.props.triggerStartTime) {
            const timeSinceTrigger = this.props.audioContext.currentTime - this.props.triggerStartTime
            const newRemainingAttackTime = this.props.amplifierAttackTime - timeSinceTrigger
            const newAttackEndTime = this.props.audioContext.currentTime + newRemainingAttackTime

            this.amplifier.gain.cancelScheduledValues(this.props.audioContext.currentTime)
            this.updateGain(this.amplifier.gain.value)
            this.updateGain(1, newAttackEndTime, 'linear')
            this.updateGain(this.props.amplifierSustainLevel, newAttackEndTime + this.props.amplifierDecayTime, 'linear')
        }
    }

    updateDecay () {
        if (this.props.triggerStartTime) {
            
        }
    }

    triggerEnvelope (prevProps) {
        const { 
            audioContext, 
            currentKeys, 
            amplifierAttackTime, 
            amplifierDecayTime,
            amplifierSustainLevel
        } = this.props
        const currentKey = currentKeys[currentKeys.length - 1]
        const prevKey = prevProps.currentKeys[prevProps.currentKeys.length - 1]

        if (((currentKeys.length > 1) || (prevProps.currentKeys.includes(currentKey) && currentKeys.length === 1)) && !this.props.retrigger) {
            // if retrigger mode is off, then we don't want to retrigger the envelope when we receive 
            // new key events, we just want to continue the envelope from where it left off
        } else if (currentKeys.length > 0 && currentKey !== prevKey) {
            // retrigger envelope on receiving new key press or removing a key with more keys 
            // still engaged
            this.cancelScheduledValues()
            this.updateGain(0, audioContext.currentTime)
            this.updateGain(1, amplifierAttackTime + audioContext.currentTime, 'linear')
            this.updateGain(amplifierSustainLevel, amplifierDecayTime + amplifierAttackTime + audioContext.currentTime, 'linear')
        } else if (currentKey !== prevKey && currentKey === undefined) {
            // initiate Release stage
            console.log('blah')
            this.cancelScheduledValues()
            this.updateGain(this.amplifier.gain.value)
            this.updateGain(0, this.props.amplifierReleaseTime + audioContext.currentTime, 'linear')
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