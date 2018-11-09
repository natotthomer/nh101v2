import React, { Component } from 'react'

import VoiceContainer from './building-blocks/Voice-container'
import Range from './input/Range'

import { REGISTERED_KEYS } from '../constants/keyboard-constants'
import { frequencyFromNoteNumber } from '../utils'

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
            filterSustainLevel: 0.5,
            filterReleaseTime: 0.3,
            filterCutoffFrequency: 1000,
            filterQ: 1.0,
            filterEnvelopeAmount: 1.0,
            controller: 'keyboard',
            oscillatorOctave: 3,
            currentKey: null,
            triggerStartTime: null,
            retrigger: true
        }

        this.handleOscillatorOctaveChange = this.handleOscillatorOctaveChange.bind(this)
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

    handleOscillatorOctaveChange (e) {
        this.setState({ oscillatorOctave: parseInt(e.target.value) })
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
                <VoiceContainer
                    {...this.state} 
                    audioContext={this.props.audioContext} />
                <div className="main-controls">
                    <div className="module" id="oscillator-controls">
                        <div className="module-title">VCO</div>
                        <div className="module-controls">
                            <div className="module-controls-column">
                                <Range title="Octave"
                                    min={1}
                                    max={7}
                                    step={1}
                                    value={this.state.oscillatorOctave}
                                    handleChange={this.handleOscillatorOctaveChange} />
                            </div>
                        </div>
                    </div>

                    <div className="module" id="filter-controls">
                        <div className="module-title">VCF</div>
                        <div className="module-controls">
                            <div className="module-controls-column">
                                <Range title="Attack"
                                    min={0.001}
                                    max={10.0}
                                    step={0.001}
                                    value={this.state.filterAttackTime}
                                    handleChange={this.handleFilterAttackTimeChange} />
                                <Range title="Decay"
                                    min={0.001}
                                    max={10.0}
                                    step={0.001}
                                    value={this.state.filterDecayTime}
                                    handleChange={this.handleFilterDecayTimeChange} />
                                <Range title="Sustain"
                                    min={0.001}
                                    max={1.0}
                                    step={0.001}
                                    value={this.state.filterSustainLevel}
                                    handleChange={this.handleFilterSustainLevelChange} />
                                <Range title="Release"
                                    min={0.001}
                                    max={10.0}
                                    step={0.001}
                                    value={this.state.filterReleaseTime}
                                    handleChange={this.handleFilterReleaseTimeChange} />
                            </div>
                            <div className="module-controls-column">
                                <Range title="Cutoff"
                                    min={0.001}
                                    max={20000}
                                    step={0.001}
                                    value={this.state.filterCutoffFrequency}
                                    handleChange={this.handleFilterCutoffFrequencyChange} />
                                <Range title="Resonance"
                                    min={0.001}
                                    max={75}
                                    step={0.001}
                                    value={this.state.filterQ}
                                    handleChange={this.handleFilterQChange} />
                                <Range title="Envelope Amount"
                                    min={0.0}
                                    max={1.0}
                                    step={0.001}
                                    value={this.state.filterEnvelopeAmount}
                                    handleChange={this.handleFilterEnvelopeAmountChange} />
                            </div>
                        </div>
                    </div>
                    <div className="module" id="amplifier-controls">
                        <div className="module-title">VCA</div>
                        <div className="module-controls">
                            <div className="module-controls-column">
                                <Range title="Attack"
                                    min={0.001}
                                    max={10.0}
                                    step={0.001}
                                    value={this.state.amplifierAttackTime}
                                    handleChange={this.handleAmplifierAttackTimeChange} />
                                <Range title="Decay"
                                    min={0.001}
                                    max={10.0}
                                    step={0.001}
                                    value={this.state.amplifierDecayTime}
                                    handleChange={this.handleAmplifierDecayTimeChange} />
                                <Range title="Sustain"
                                    min={0.001}
                                    max={1.0}
                                    step={0.001}
                                    value={this.state.amplifierSustainLevel}
                                    handleChange={this.handleAmplifierSustainLevelChange} />
                                <Range title="Release"
                                    min={0.000}
                                    max={10.0}
                                    step={0.001}
                                    value={this.state.amplifierReleaseTime}
                                    handleChange={this.handleAmplifierReleaseTimeChange} />
                            </div>
                            <div className="module-controls-column">
                                <input type='button' name="retrigger-mode" onClick={this.handleRetriggerChange} value={`Retrigger ${this.state.retrigger ? 'on' : 'off'}`} />
                            </div>
                        </div>
                    </div>
                </div>
                <div>Current Controller: {this.state.controller}</div>
            </div>
        )
    }
}