import React, { Component } from 'react'

import { REGISTERED_KEYS } from './constants/keyboard-constants'
import VoiceContainer from './building-blocks/Voice-container'
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
            retrigger: false
        }

        this.handleAmplifierAttackTimeChange = this.handleAmplifierAttackTimeChange.bind(this)
        // this.handleAmplifierDecayTimeChange = this.handleAmplifierDecayTimeChange.bind(this)
        // this.handleAmplifierSustainLevelChange = this.handleAmplifierSustainLevelChange.bind(this)
        // this.handleAmplifierReleaseTimeChange = this.handleAmplifierReleaseTimeChange.bind(this)
        this.handleRetriggerChange = this.handleRetriggerChange.bind(this)
    }

    componentDidUpdate (prevProps, prevState) {
        if (this.props.keyboard.currentKeys.length !== prevProps.keyboard.currentKeys.length) {
            this.setState({ triggerStartTime: this.props.audioContext.currentTime })
        } else if (this.props.keyboard.currentKeys.length === 0 && this.state.triggerStartTime) {
            this.setState({ triggerStartTime: null })
        }
    }

    handleAmplifierAttackTimeChange (e) {
        this.setState({ amplifierAttackTime: parseFloat(e.target.value) })
        
        // let diff
        // if (this.state.triggerStartTime) {
        //     diff = this.props.audioContext.currentTime - this.state.triggerStartTime
        // }
        // // console.log('diff', this.state.amplifierAttackTime - parseFloat(e.target.value))
        // const oldAttackTime = this.state.amplifierAttackTime
        // const newAttackTime = parseFloat(e.target.value)
        // // console.log('new, old', newAttackTime, oldAttackTime)
        // this.setState({ amplifierAttackTime: newAttackTime }, () => {
        //     if (diff !== undefined) {
        //         const newTime = this.props.audioContext.currentTime + newAttackTime - diff
        //         // console.log('newTime: ', newTime)
        //         // console.log('currentTime', this.props.audioContext.currentTime)
        //         // console.log(this.voice.vca)
        //         console.log(this.voice)
        //         this.voice.vca.amplifier.gain.linearRampToValueAtTime(1, newTime)
        //     }
        // })
    }

    // handleAmplifierDecayTimeChange (e) {
    //     this.setState({ amplifierDecayTime: parseFloat(e.target.value) })
    // }

    // handleAmplifierSustainLevelChange (e) {
    //     this.setState({ amplifierSustainLevel: parseFloat(e.target.value) })
    // }

    // handleAmplifierReleaseTimeChange (e) {
    //     this.setState({ amplifierReleaseTime: parseFloat(e.target.value) })
    // }

    handleRetriggerChange (e) {
        this.setState({ retrigger: !this.state.retrigger })
    }

    render () {
        return (
            <div style={{ height: '100%', width: '100%' }}>
                <div id="chartContainer" style={{ height: "300px", width: "100%" }}></div>

                <div id="sliders">
                    <input type='range' min={0.001} max={10.0} step={0.001} value={this.state.amplifierAttackTime} onChange={this.handleAmplifierAttackTimeChange} name="amplifier-attack-time" /> <label htmlFor="amplifier-attack-time">Attack {this.state.amplifierAttackTime}</label>
                    <input type='range' min={0.001} max={10.0} step={0.001} readOnly value={this.state.amplifierDecayTime} name="amplifier-decay-time" /> <label htmlFor="amplifier-decay-time">Decay {this.state.amplifierDecayTime}</label>
                    <input type='range' min={0.000} max={1.0} step={0.001} readOnly value={this.state.amplifierSustainLevel} name="amplifier-sustain-level" /> <label htmlFor="amplifier-sustain-level">Sustain {this.state.amplifierSustainLevel}</label>
                    <input type='range' min={0.001} max={10.0} step={0.001} readOnly value={this.state.amplifierReleaseTime} name="amplifier-release-time" /> <label htmlFor="amplifier-release-time">Release {this.state.amplifierReleaseTime}</label>
                    <input type='button' name="retrigger-mode" onClick={this.handleRetriggerChange} value={`Retrigger ${this.state.retrigger ? 'on' : 'off'}`} />
                </div>
                <div>Current Controller: {this.state.controller}</div>
                <div>Current Octave: {this.state.octave}</div>
                <VoiceContainer 
                    ref={ref => (this.voice = ref)} 
                    {...this.state} 
                    audioContext={this.props.audioContext} />
            </div>
        )
    }
}