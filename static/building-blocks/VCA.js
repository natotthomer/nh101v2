import React from 'react'

import { buildCanvas } from '../synth-charts'

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
        this.loop = this.loop.bind(this)
    }

    componentDidMount () {
        buildCanvas(this.amplifier)
        this._frameId = window.requestAnimationFrame(this.loop);
    }

    componentDidUpdate (prevProps, prevState) {
        this.triggerEnvelope(prevProps)
        if (this.props.amplifierAttackTime !== prevProps.amplifierAttackTime) {
            this.updateAttack(prevProps, prevState)
        }
    }

    loop () {
        this.setState({ time: this.props.audioContext.currentTime })

        this._frameId = window.requestAnimationFrame(this.loop);
    }

    updateAttack (prevProps, prevState) {
        if (this.props.triggerStartTime) {
            const timeSinceTrigger = this.props.audioContext.currentTime - this.props.triggerStartTime
            const newRemainingAttackTime = this.props.amplifierAttackTime - timeSinceTrigger

            this.amplifier.gain.cancelScheduledValues(this.props.audioContext.currentTime)
            this.updateGain(this.amplifier.gain.value)
            this.updateGain(1, this.props.audioContext.currentTime + newRemainingAttackTime, 'linear')
        }
    }

    triggerEnvelope (prevProps) {
        const { audioContext, currentKeys, amplifierAttackTime } = this.props
        const currentKey = currentKeys[currentKeys.length - 1]
        const prevKey = prevProps.currentKeys[prevProps.currentKeys.length - 1]

        if (((currentKeys.length > 1) || (prevProps.currentKeys.includes(currentKey) && currentKeys.length === 1)) && !this.props.retrigger) {
            // if retrigger mode is off, then we don't want to retrigger the envelope when we receive 
            // new key events, we just want to continue the envelope from where it left off
        } else if (currentKeys.length > 0 && currentKey !== prevKey) {
            this.cancelScheduledValues()
            this.updateGain(0, audioContext.currentTime)
            this.updateGain(1, amplifierAttackTime + audioContext.currentTime, 'linear')
            this.updateGain(0, 0.1 + amplifierAttackTime + audioContext.currentTime, 'linear')
        } else if (currentKey !== prevKey) {
            this.cancelScheduledValues()
            this.updateGain(0)
        }
    }

    cancelScheduledValues (atTime = this.props.audioContext.currentTime) {
        this.amplifier.gain.cancelScheduledValues(atTime)
    }
    
    updateGain(newValue, atTime=this.props.audioContext.currentTime, slopeType=null) {
        switch (slopeType) {
            case 'exponential': {
                // Will break if `newValue` is 0 and slopeType is `exponential`
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