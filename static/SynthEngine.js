import React, { Component } from 'react'

import { REGISTERED_KEYS, RETRIGGER_MODES } from './constants/keyboard-constants'
import VoiceContainer from './building-blocks/Voice-container'
import { buildCanvas } from './synth-charts'
import { frequencyFromNoteNumber } from './utils'

export default class SynthEngine extends Component {
    constructor (props) {
        super(props)

        this.state = {
            amplifierAttackTime: 1.0,
            amplifierDecayTime: 0.1,
            amplifierReleaseTime: 0.001,
            amplifierSustainLevel: 0.001,
            controller: 'keyboard',
            octave: 4,
            currentKey: null,
            triggerStartTime: null,
            gate: false,
            retrigger: RETRIGGER_MODES[0]
        }

        // this.updateAmplifierAttackTime = this.updateAmplifierAttackTime.bind(this)
        // this.updateAmplifierDecayTime = this.updateAmplifierDecayTime.bind(this)
        // this.updateAmplifierSustainLevel = this.updateAmplifierSustainLevel.bind(this)
        // this.updateAmplifierReleaseTime = this.updateAmplifierReleaseTime.bind(this)
    }

    // updateAmplifierAttackTime (e) {
    //     let diff
    //     if (this.state.triggerStartTime) {
    //         diff = this.props.audioContext.currentTime - this.state.triggerStartTime
    //     }
    //     // console.log('diff', this.state.amplifierAttackTime - parseFloat(e.target.value))
    //     const oldAttackTime = this.state.amplifierAttackTime
    //     const newAttackTime = parseFloat(e.target.value)
    //     // console.log('new, old', newAttackTime, oldAttackTime)
    //     this.setState({ amplifierAttackTime: newAttackTime }, () => {
    //         console.log(this.state.amplifierAttackTime)
    //         if (diff !== undefined) {
    //             const newTime = this.props.audioContext.currentTime + newAttackTime - diff
    //             // console.log('newTime: ', newTime)
    //             // console.log('currentTime', this.props.audioContext.currentTime)
    //             console.log('last')
    //             this.gainNode.gain.linearRampToValueAtTime(1, newTime)
    //         }
    //     })
    // }

    // updateAmplifierDecayTime (e) {
    //     this.setState({ amplifierDecayTime: parseFloat(e.target.value) })
    // }

    // updateAmplifierSustainLevel (e) {
    //     this.setState({ amplifierSustainLevel: parseFloat(e.target.value) })
    // }

    // updateAmplifierReleaseTime (e) {
    //     this.setState({ amplifierReleaseTime: parseFloat(e.target.value) })
    // }

    render () {
        return (
            <div style={{ height: '100%', width: '100%' }}>
                <div id="chartContainer" style={{ height: "300px", width: "100%" }}></div>

                <div id="sliders">
                    <input type='range' min={0.001} max={10.0} step={0.001} readOnly value={this.state.amplifierAttackTime} name="amplifier-attack-time" /> <label htmlFor="attack-time">Attack {this.state.amplifierAttackTime}</label>
                    <input type='range' min={0.001} max={10.0} step={0.001} readOnly value={this.state.amplifierDecayTime} name="amplifier-decay-time" /> <label htmlFor="decay-time">Decay {this.state.amplifierDecayTime}</label>
                    <input type='range' min={0.000} max={1.0} step={0.001} readOnly value={this.state.amplifierSustainLevel} name="amplifier-sustain-level" /> <label htmlFor="sustain-level">Sustain {this.state.amplifierSustainLevel}</label>
                    <input type='range' min={0.001} max={10.0} step={0.001} readOnly value={this.state.amplifierReleaseTime} name="amplifier-`release-time" /> <label htmlFor="release-time">Release {this.state.amplifierReleaseTime}</label>
                </div>
                <div>Current Controller: {this.state.controller}</div>
                <div>Current Octave: {this.state.octave}</div>
                <VoiceContainer 
                    onRef={ref => (this.voice = ref)} 
                    {...this.state} 
                    audioContext={this.props.audioContext} />
            </div>
        )
    }
}