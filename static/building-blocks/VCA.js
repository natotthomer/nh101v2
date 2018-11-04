import React from 'react'

import { buildCanvas } from '../synth-charts'

export default class VCA extends React.Component {
    constructor (props) {
        super(props)

        this.amplifier = this.props.audioContext.createGain()
        this.amplifier.gain.value = 0

        this.updateGain = this.updateGain.bind(this)
    }

    componentDidMount () {
        buildCanvas(this.amplifier)
    }

    componentDidUpdate (prevProps, prevState) {
        const { audioContext, currentKeys, amplifierAttackTime } = this.props
        const currentKey = currentKeys[currentKeys.length - 1]
        const prevKey = prevProps.currentKeys[prevProps.currentKeys.length - 1]
        if (((currentKeys.length > 1) || (prevProps.currentKeys.includes(currentKey) && currentKeys.length === 1)) && !this.props.retrigger) {
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