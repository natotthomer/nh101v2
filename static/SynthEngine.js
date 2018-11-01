import React, { Component } from 'react'

import { REGISTERED_KEYS, RETRIGGER_MODES } from './constants/keyboard-constants'
import Voice from './building-blocks/Voice'
import { buildCanvas } from './synth-charts'
import { frequencyFromNoteNumber } from './utils'

export default class SynthEngine extends Component {
    constructor (props) {
        super(props)

        this.state = {
            attackTime: 1.0,
            decayTime: 0.1,
            releaseTime: 0.001,
            sustainLevel: 0.001,
            controller: 'keyboard',
            octave: 4,
            currentKey: null,
            triggerStartTime: null,
            gate: false,
            retrigger: RETRIGGER_MODES[0]
        }

        this.voice = new Voice(this.props.audioContext)

        // this.updateAttackTime = this.updateAttackTime.bind(this)
        // this.updateDecayTime = this.updateDecayTime.bind(this)
        // this.updateSustainLevel = this.updateSustainLevel.bind(this)
        // this.updateReleaseTime = this.updateReleaseTime.bind(this)
        this.triggerEnvelope = this.triggerEnvelope.bind(this)
        this.triggerReleaseStage = this.triggerReleaseStage.bind(this)
        this.receivedNewGate = this.receivedNewGate.bind(this)
        this.receivedGate = this.receivedGate.bind(this)
    }

    componentDidMount () {
        buildCanvas(this.voice)
    }

    componentDidUpdate (prevProps, prevState) {
        const { keyboard } = this.props
        if (this.receivedNewGate(this.props, prevProps)) {
            console.log('new gate')
            const key = keyboard.currentKeys[keyboard.currentKeys.length - 1]
            const noteNumber = REGISTERED_KEYS.indexOf(key) + (12 * this.state.octave)
            this.voice.updateOscillatorFrequency(frequencyFromNoteNumber(noteNumber))
            this.triggerEnvelope(keyboard.currentKeys[keyboard.currentKeys.length - 1])
        } else if (this.receivedGate(this.props, prevProps)) {
            debugger
            if (this.state.retrigger === 'off') {
                console.log('retrigger off')
                const key = keyboard.currentKeys[keyboard.currentKeys.length - 1]
                const noteNumber = REGISTERED_KEYS.indexOf(key) + (12 * this.state.octave)
                this.voice.updateOscillatorFrequency(frequencyFromNoteNumber(noteNumber))
            } else if (this.state.retrigger === 'hard') {
                const key = keyboard.currentKeys[keyboard.currentKeys.length - 1]
                const noteNumber = REGISTERED_KEYS.indexOf(key) + (12 * this.state.octave)
                this.voice.updateOscillatorFrequency(frequencyFromNoteNumber(noteNumber))
            }
        }
        
    }

    triggerEnvelope (key) {
        this.setState({ currentKey: key, triggerStartTime: this.props.audioContext.currentTime, gate: true }, () => {
            this.voice.cancelAmplifierGainSchedule()
            // this.voice.updateAmpliferGain(1)
            this.voice.updateAmpliferGain(1, this.props.audioContext.currentTime + this.state.attackTime)
            this.voice.updateAmpliferGain(this.state.sustainLevel, this.props.audioContext.currentTime + this.state.attackTime + this.state.decayTime)
        })
    }

    triggerReleaseStage () {
        this.setState({ triggerStartTime: null, gate: false })
        this.voice.updateAmpliferGain(0)
        this.voice.cancelAndHoldAtTime(this.props.audioContext.currentTime)
        this.voice.updateAmpliferGain(0, this.props.audioContext.currentTime + this.state.releaseTime)
        this.setState({ currentKey: null })
    }

    receivedNewGate (currentProps, prevProps) {
        return currentProps.keyboard.gate && !prevProps.keyboard.gate
    }

    receivedGate (currentProps, prevProps) {
        return currentProps.keyboard.gate
    }

    // updateAttackTime (e) {
    //     let diff
    //     if (this.state.triggerStartTime) {
    //         diff = this.props.audioContext.currentTime - this.state.triggerStartTime
    //     }
    //     // console.log('diff', this.state.attackTime - parseFloat(e.target.value))
    //     const oldAttackTime = this.state.attackTime
    //     const newAttackTime = parseFloat(e.target.value)
    //     // console.log('new, old', newAttackTime, oldAttackTime)
    //     this.setState({ attackTime: newAttackTime }, () => {
    //         console.log(this.state.attackTime)
    //         if (diff !== undefined) {
    //             const newTime = this.props.audioContext.currentTime + newAttackTime - diff
    //             // console.log('newTime: ', newTime)
    //             // console.log('currentTime', this.props.audioContext.currentTime)
    //             console.log('last')
    //             this.gainNode.gain.linearRampToValueAtTime(1, newTime)
    //         }
    //     })
    // }

    // updateDecayTime (e) {
    //     this.setState({ decayTime: parseFloat(e.target.value) })
    // }

    // updateSustainLevel (e) {
    //     this.setState({ sustainLevel: parseFloat(e.target.value) })
    // }

    // updateReleaseTime (e) {
    //     this.setState({ releaseTime: parseFloat(e.target.value) })
    // }

    render () {
        return (
            <div style={{ height: '100%', width: '100%' }}>
                <div id="chartContainer" style={{ height: "300px", width: "100%" }}></div>

                <div id="sliders">
                    <input type='range' min={0.001} max={10.0} step={0.001} readOnly value={this.state.attackTime} name="attack-time" /> <label htmlFor="attack-time">Attack {this.state.attackTime}</label>
                    <input type='range' min={0.001} max={10.0} step={0.001} readOnly value={this.state.decayTime} name="decay-time" /> <label htmlFor="decay-time">Decay {this.state.decayTime}</label>
                    <input type='range' min={0.000} max={1.0} step={0.001} readOnly value={this.state.sustainLevel} name="sustain-level" /> <label htmlFor="sustain-level">Sustain {this.state.sustainLevel}</label>
                    <input type='range' min={0.001} max={10.0} step={0.001} readOnly value={this.state.releaseTime} name="release-time" /> <label htmlFor="release-time">Release {this.state.releaseTime}</label>
                </div>
                <div>Current Controller: {this.state.controller}</div>
                <div>Current Octave: {this.state.octave}</div>
            </div>
        )
    }
}