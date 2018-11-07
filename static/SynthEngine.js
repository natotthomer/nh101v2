import React, { Component } from 'react'

import { REGISTERED_KEYS } from './constants/keyboard-constants'
import VoiceContainer from './building-blocks/Voice-container'
import { frequencyFromNoteNumber } from './utils'

export default class SynthEngine extends Component {
    constructor (props) {
        super(props)

        this.state = {
            amplifierAttackTime: 1.0,
            amplifierDecayTime: 1.0,
            amplifierSustainLevel: 0.5,
            amplifierReleaseTime: 0.3,
            filterAttackTime: 1.0,
            filterDecayTime: 1.0,
            filterSustainLevel: 4000,
            filterReleaseTime: 0.3,
            filterCutoffFrequency: 1000,
            filterQ: 1.0,
            filterEnvelopeAmount: 1.0,
            controller: 'keyboard',
            octave: 3,
            currentKey: null,
            triggerStartTime: null,
            retrigger: true
        }

        this.handleAmplifierAttackTimeChange = this.handleAmplifierAttackTimeChange.bind(this)
        this.handleAmplifierDecayTimeChange = this.handleAmplifierDecayTimeChange.bind(this)
        this.handleAmplifierSustainLevelChange = this.handleAmplifierSustainLevelChange.bind(this)
        this.handleAmplifierReleaseTimeChange = this.handleAmplifierReleaseTimeChange.bind(this)
        this.handleFilterAttackTimeChange = this.handleFilterAttackTimeChange.bind(this)
        this.handleFilterDecayTimeChange = this.handleFilterDecayTimeChange.bind(this)
        this.handleFilterSustainLevelChange = this.handleFilterSustainLevelChange.bind(this)
        this.handleFilterReleaseTimeChange = this.handleFilterReleaseTimeChange.bind(this)
        this.handleFilterCutoffFrequencyChange = this.handleFilterCutoffFrequencyChange.bind(this)
        this.handleFilterQChange = this.handleFilterQChange.bind(this)
        this.handleFilterEnvelopeAmountChange = this.handleFilterEnvelopeAmountChange.bind(this)
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
    }

    handleAmplifierDecayTimeChange (e) {
        this.setState({ amplifierDecayTime: parseFloat(e.target.value) })
    }

    handleAmplifierSustainLevelChange (e) {
        this.setState({ amplifierSustainLevel: parseFloat(e.target.value) })
    }

    handleAmplifierReleaseTimeChange (e) {
        this.setState({ amplifierReleaseTime: parseFloat(e.target.value) })
    }

    handleFilterAttackTimeChange (e) {
        this.setState({ filterAttackTime: parseFloat(e.target.value) })
    }

    handleFilterDecayTimeChange (e) {
        this.setState({ filterDecayTime: parseFloat(e.target.value) })
    }

    handleFilterSustainLevelChange (e) {
        this.setState({ filterSustainLevel: parseFloat(e.target.value) })
    }

    handleFilterReleaseTimeChange (e) {
        this.setState({ filterReleaseTime: parseFloat(e.target.value) })
    }

    handleFilterCutoffFrequencyChange (e) {
        this.setState({ filterCutoffFrequency: parseFloat(e.target.value) })
    }

    handleFilterQChange (e) {
        this.setState({ filterQ: parseFloat(e.target.value) })
    }

    handleFilterEnvelopeAmountChange (e) {
        this.setState({ filterEnvelopeAmount: parseFloat(e.target.value) })
    }

    handleRetriggerChange (e) {
        this.setState({ retrigger: !this.state.retrigger })
    }

    render () {
        return (
            <div style={{ height: '100%', width: '100%' }}>
                <div id="chartContainer" style={{ height: "300px", width: "100%" }}></div>

                <div id="filter-sliders">
                    <div>VCF</div>
                    <div style={{ display: 'flex' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}><span>ADSR</span>
                            <label htmlFor="filter-attack-time"><input type='range' min={0.001} max={10.0} step={0.001} value={this.state.filterAttackTime} onChange={this.handleFilterAttackTimeChange} name="filter-attack-time" />Attack {this.state.filterAttackTime}</label>
                            <label htmlFor="filter-decay-time"><input type='range' min={0.001} max={10.0} step={0.001} value={this.state.filterDecayTime} onChange={this.handleFilterDecayTimeChange} name="filter-decay-time" />Decay {this.state.filterDecayTime}</label>
                            <label htmlFor="filter-sustain-level"><input type='range' min={0.000} max={20000.0} step={0.001} value={this.state.filterSustainLevel} onChange={this.handleFilterSustainLevelChange} name="filter-sustain-level" />Sustain {this.state.filterSustainLevel}</label>
                            <label htmlFor="filter-release-time"><input type='range' min={0.001} max={10.0} step={0.001} value={this.state.filterReleaseTime} onChange={this.handleFilterReleaseTimeChange} name="filter-release-time" />Release {this.state.filterReleaseTime}</label>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="filter-cutoff-frequency"><input type='range' min={0.001} max={20000.0} step={0.001} value={this.state.filterCutoffFrequency} onChange={this.handleFilterCutoffFrequencyChange} name="filter-cutoff-frequency" />Cutoff {this.state.filterCutoffFrequency}</label>
                            <label htmlFor="filter-q"><input type='range' min={0.001} max={75} step={0.001} value={this.state.filterQ} onChange={this.handleFilterQChange} name="filter-q" />Resonance {this.state.filterQ}</label>
                            <label htmlFor="filter-envelope-amount"><input type='range' min={0.0} max={1} step={0.001} value={this.state.filterEnvelopeAmount} onChange={this.handleFilterEnvelopeAmountChange} name="filter-envelope-amount" />Envelope Amount {this.state.filterEnvelopeAmount}</label>
                        </div>
                    </div>
                </div>
                <div id="amplifier-sliders">
                    <div>VCA</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}><span>ADSR</span>
                        <label htmlFor="amplifier-attack-time"><input type='range' min={0.001} max={10.0} step={0.001} value={this.state.amplifierAttackTime} onChange={this.handleAmplifierAttackTimeChange} name="amplifier-attack-time" />Attack {this.state.amplifierAttackTime}</label>
                        <label htmlFor="amplifier-decay-time"><input type='range' min={0.001} max={10.0} step={0.001} value={this.state.amplifierDecayTime} onChange={this.handleAmplifierDecayTimeChange} name="amplifier-decay-time" />Decay {this.state.amplifierDecayTime}</label>
                        <label htmlFor="amplifier-sustain-level"><input type='range' min={0.000} max={1.0} step={0.001} value={this.state.amplifierSustainLevel} onChange={this.handleAmplifierSustainLevelChange} name="amplifier-sustain-level" />Sustain {this.state.amplifierSustainLevel}</label>
                        <label htmlFor="amplifier-release-time"><input type='range' min={0.001} max={10.0} step={0.001} value={this.state.amplifierReleaseTime} onChange={this.handleAmplifierReleaseTimeChange} name="amplifier-release-time" />Release {this.state.amplifierReleaseTime}</label>
                    </div>
                </div>
                <input type='button' name="retrigger-mode" onClick={this.handleRetriggerChange} value={`Retrigger ${this.state.retrigger ? 'on' : 'off'}`} />
                
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