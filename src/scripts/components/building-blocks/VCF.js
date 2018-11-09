import React from 'react'

import { calculateAttackFrequency, calculateSustainFrequency } from '../../utils'

export default class VCF extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            time: 0.0,
            attackStageEnd: null,
            decayStageEnd: null,
            releaseStageEnd: null,
            sustainStageEnd: null
        }

        this.filter = this.props.audioContext.createBiquadFilter()
        this.filter.frequency.value = this.props.filterCutoffFrequency
        this.filter.Q.value = this.props.filterQ

        this.updateFrequency = this.updateFrequency.bind(this)
        this.updateQ = this.updateQ.bind(this)
        this.cancelScheduledValues = this.cancelScheduledValues.bind(this)
        this.triggerEnvelope = this.triggerEnvelope.bind(this)
        this.updateAttack = this.updateAttack.bind(this)
        this.updateDecay = this.updateDecay.bind(this)
        this.updateSustain = this.updateSustain.bind(this)
        this.updateRelease = this.updateRelease.bind(this)
        this.updateFilterEnvelopeAmount = this.updateFilterEnvelopeAmount.bind(this)
    }

    componentDidUpdate (prevProps, prevState) {
        this.triggerEnvelope(prevProps)
        // These are checking whether the values are changing while the envelope is in 
        // process, and therefore whether the current rates of change need to change
        if (this.props.filterAttackTime !== prevProps.filterAttackTime) {
            this.updateAttack()
        } else if (this.props.filterDecayTime !== prevProps.filterDecayTime) {
            this.updateDecay()
        } else if (this.props.filterSustainLevel !== prevProps.filterSustainLevel) {
            this.updateSustain()
        } else if (this.props.filterReleaseTime !== prevProps.filterReleaseTime) {
            this.updateRelease()
        } else if (this.props.filterCutoffFrequency !== prevProps.filterCutoffFrequency) {
            this.updateFrequency(this.props.filterCutoffFrequency)
        } else if (this.props.filterQ !== prevProps.filterQ) {
            this.updateQ(this.props.filterQ)
        } else if (this.props.filterEnvelopeAmount !== prevProps.filterEnvelopeAmount) {
            this.updateFilterEnvelopeAmount(prevProps)
        }
    }

    updateAttack () {
        const { 
            triggerStartTime, 
            audioContext, 
            filterAttackTime, 
            filterDecayTime, 
            filterSustainLevel,
            filterCutoffFrequency,
            filterEnvelopeAmount
        } = this.props

        if (triggerStartTime && (audioContext.currentTime < this.state.attackStageEnd)) {
            const timeSinceTrigger = audioContext.currentTime - triggerStartTime
            const newRemainingAttackTime = filterAttackTime - timeSinceTrigger
            const attackFrequency = calculateAttackFrequency(filterCutoffFrequency, filterEnvelopeAmount)
            const sustainFrequency = calculateSustainFrequency(filterCutoffFrequency, filterEnvelopeAmount, filterSustainLevel)
            
            let attackStageEnd = audioContext.currentTime + newRemainingAttackTime
            let decayStageEnd = attackStageEnd + filterDecayTime
            
            this.cancelScheduledValues()
            this.updateFrequency(this.filter.frequency.value)

            if (attackStageEnd < audioContext.currentTime) {
                attackStageEnd = audioContext.currentTime
                decayStageEnd = audioContext.currentTime + filterDecayTime
            }
            
            this.updateFrequency(attackFrequency, attackStageEnd, 'linear')
            this.setState({ attackStageEnd, decayStageEnd })
            this.updateFrequency(sustainFrequency, decayStageEnd, 'linear')
        }
    }

    updateDecay () {
        const { 
            triggerStartTime, 
            audioContext, 
            filterDecayTime, 
            filterSustainLevel,
            filterCutoffFrequency,
            filterEnvelopeAmount
        } = this.props

        const sustainFrequency = calculateSustainFrequency(filterCutoffFrequency, filterEnvelopeAmount, filterSustainLevel)

        if (triggerStartTime && audioContext.currentTime < this.state.attackStageEnd) {
            const decayStageEnd = this.state.attackStageEnd + filterDecayTime
            
            this.filter.frequency.cancelAndHoldAtTime(this.state.attackStageEnd)
            this.filter.frequency.setValueAtTime(this.filter.frequency.value, audioContext.currentTime)
            this.updateFrequency(sustainFrequency, decayStageEnd, 'linear')
            this.setState({ decayStageEnd })
        } else if (triggerStartTime && (audioContext.currentTime < this.state.decayStageEnd) && (audioContext.currentTime > this.state.attackStageEnd)) {
            const timeSinceAttackStageEnded = audioContext.currentTime - this.state.attackStageEnd
            const newRemainingDecayTime = filterDecayTime - timeSinceAttackStageEnded

            let decayStageEnd = audioContext.currentTime + newRemainingDecayTime
            this.cancelScheduledValues()
            this.updateFrequency(this.filter.frequency.value)
            
            if (decayStageEnd < audioContext.currentTime) {
                decayStageEnd = audioContext.currentTime
            }

            this.updateFrequency(sustainFrequency, decayStageEnd, 'linear')
            this.setState({ decayStageEnd })
        }
    }

    updateSustain () {
        const { 
            triggerStartTime, 
            audioContext, 
            filterSustainLevel, 
            filterDecayTime,
            filterCutoffFrequency,
            filterEnvelopeAmount
        } = this.props
        const sustainFrequency = calculateSustainFrequency(filterCutoffFrequency, filterEnvelopeAmount, filterSustainLevel)

        if (triggerStartTime && audioContext.currentTime < this.state.attackStageEnd) {
            const decayStageEnd = this.state.attackStageEnd + filterDecayTime
            
            this.filter.frequency.cancelAndHoldAtTime(this.state.attackStageEnd)
            this.filter.frequency.setValueAtTime(this.filter.frequency.value, audioContext.currentTime)
            this.updateFrequency(sustainFrequency, decayStageEnd, 'linear')
            this.setState({ decayStageEnd })
        } else if (triggerStartTime && audioContext.currentTime < this.state.decayStageEnd) {
            this.filter.frequency.cancelScheduledValues(audioContext.currentTime)
            this.filter.frequency.setValueAtTime(this.filter.frequency.value, audioContext.currentTime)
            this.updateFrequency(sustainFrequency, this.state.decayStageEnd, 'linear')
        } else if (triggerStartTime) {
            this.updateFrequency(sustainFrequency)
        }
    }

    updateRelease () {
        if (this.filter.frequency.value > this.props.filterCutoffFrequency && this.state.releaseStageEnd) {
            const { filterReleaseTime, audioContext } = this.props
            
            const timeSinceSustainStageEnded = audioContext.currentTime - this.state.sustainStageEnd
            const newRemainingReleaseTime = filterReleaseTime - timeSinceSustainStageEnded

            let releaseStageEnd = audioContext.currentTime + newRemainingReleaseTime

            this.cancelScheduledValues()
            this.updateFrequency(this.filter.frequency.value)

            if (releaseStageEnd < audioContext.currentTime) {
                releaseStageEnd = audioContext.currentTime
            }
            
            this.updateFrequency(this.props.filterCutoffFrequency, releaseStageEnd, 'linear')
            this.setState({ releaseStageEnd })
        }
    }

    updateFilterEnvelopeAmount (prevProps) {
        const {
            triggerStartTime,
            audioContext,
            filterAttackTime,
            filterDecayTime,
            filterSustainLevel,
            filterReleaseTime,
            filterCutoffFrequency,
            filterEnvelopeAmount
        } = this.props
        const attackFrequency = calculateAttackFrequency(filterCutoffFrequency, filterEnvelopeAmount)
        const sustainFrequency = calculateSustainFrequency(filterCutoffFrequency, filterEnvelopeAmount, filterSustainLevel)
        const prevAttackFrequency = calculateAttackFrequency(prevProps.filterCutoffFrequency, prevProps.filterEnvelopeAmount)
        const prevSustainFrequency = calculateSustainFrequency(prevProps.filterCutoffFrequency, prevProps.filterEnvelopeAmount, prevProps.filterSustainLevel)

        if (triggerStartTime && audioContext.currentTime < this.state.attackStageEnd) {
            const newAttackFrequencyPercentOfOldAttackFrequency = (attackFrequency - filterCutoffFrequency) / (prevAttackFrequency - filterCutoffFrequency)
            const newCurrentFrequency = (this.filter.frequency.value * newAttackFrequencyPercentOfOldAttackFrequency)
            
            this.cancelScheduledValues()
            this.updateFrequency(newCurrentFrequency)
            this.updateFrequency(attackFrequency, this.state.attackStageEnd, 'linear')
        } else if (triggerStartTime && audioContext.currentTime < this.state.decayStageEnd) {
            const newDecayFrequencyPercentOfOldDecayFrequency = (sustainFrequency - filterCutoffFrequency) / (prevDecayFrequency - filterCutoffFrequency)
            const newCurrentFrequency = (this.filter.frequency.value * newDecayFrequencyPercentOfOldDecayFrequency)

            this.cancelScheduledValues()
            this.updateFrequency(newCurrentFrequency)
            this.updateFrequency(sustainFrequency, this.state.decayStageEnd, 'linear')
        }
        
    }

    triggerEnvelope (prevProps) {
        const { 
            audioContext, 
            currentKeys, 
            filterAttackTime, 
            filterDecayTime,
            filterSustainLevel,
            filterReleaseTime,
            filterCutoffFrequency,
            filterEnvelopeAmount
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
                attackStageEnd: audioContext.currentTime + filterAttackTime, 
                decayStageEnd: audioContext.currentTime + filterAttackTime + filterDecayTime, 
                sustainStageEnd: null,
                releaseStageEnd: null
            })

            const attackFrequency = calculateAttackFrequency(filterCutoffFrequency, filterEnvelopeAmount)
            const sustainFrequency = calculateSustainFrequency(filterCutoffFrequency, filterEnvelopeAmount, filterSustainLevel)
            console.log(attackFrequency)
            console.log(sustainFrequency)
            
            this.cancelScheduledValues()
            this.updateFrequency(filterCutoffFrequency)
            this.updateFrequency(attackFrequency, filterAttackTime + audioContext.currentTime, 'linear')
            this.updateFrequency(sustainFrequency, filterDecayTime + filterAttackTime + audioContext.currentTime, 'linear')
        } else if (currentKey !== prevKey && currentKey === undefined) {
            // initiate Release stage
            this.cancelScheduledValues()
            this.updateFrequency(this.filter.frequency.value)
            this.updateFrequency(this.props.filterCutoffFrequency, this.props.filterReleaseTime + audioContext.currentTime, 'linear')
            this.setState({ attackStageEnd: null, decayStageEnd: null, releaseStageEnd: audioContext.currentTime + filterReleaseTime, sustainStageEnd: audioContext.currentTime })
        }
    }

    cancelScheduledValues (atTime = this.props.audioContext.currentTime) {
        this.filter.frequency.cancelScheduledValues(atTime)
    }
    
    updateFrequency (newValue, atTime=this.props.audioContext.currentTime, slopeType=null) {
        switch (slopeType) {
            case 'exponential': {
                // Will break if `newValue` is 0 and slopeType is `exponential` (needs to
                // ANY number greater or lesser than 0.)
                this.filter.frequency.exponentialRampToValueAtTime(newValue, atTime)
                break
            }
            case 'linear': {
                this.filter.frequency.linearRampToValueAtTime(newValue, atTime)
                break
            }
            default: {
                this.filter.frequency.setValueAtTime(newValue, atTime)
                break
            }
        }
    }

    updateQ (newValue, atTime=this.props.audioContext.currentTime, slopeType=null) {
        switch (slopeType) {
            case 'exponential': {
                // Will break if `newValue` is 0 and slopeType is `exponential` (needs to
                // ANY number greater or lesser than 0.)
                this.filter.Q.exponentialRampToValueAtTime(newValue, atTime)
                break
            }
            case 'linear': {
                this.filter.Q.linearRampToValueAtTime(newValue, atTime)
                break
            }
            default: {
                this.filter.Q.setValueAtTime(newValue, atTime)
                break
            }
        }
    }

    render () {
        return null
    }
}