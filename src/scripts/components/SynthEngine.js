import React, { Component } from 'react'

import VoiceContainer from './building-blocks/Voice-container'
import ControlInterfaceContainer from './ControlInterface-container'

export default class SynthEngine extends Component {
    constructor (props) {
        super(props)

        this.handleOscillatorOneOctaveChange = this.handleOscillatorOneOctaveChange.bind(this)
        this.handleOscillatorOneDetuneChange = this.handleOscillatorOneDetuneChange.bind(this)
        this.handleOscillatorOneWaveformChange = this.handleOscillatorOneWaveformChange.bind(this)
        this.handleOscillatorOneGainChange = this.handleOscillatorOneGainChange.bind(this)
        this.handleOscillatorTwoOctaveChange = this.handleOscillatorTwoOctaveChange.bind(this)
        this.handleOscillatorTwoDetuneChange = this.handleOscillatorTwoDetuneChange.bind(this)
        this.handleOscillatorTwoWaveformChange = this.handleOscillatorTwoWaveformChange.bind(this)
        this.handleOscillatorTwoGainChange = this.handleOscillatorTwoGainChange.bind(this)
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
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidUpdate (prevProps, prevState) {
        if (this.props.keyboard.currentKeys.length !== prevProps.keyboard.currentKeys.length) {
            this.setState({ triggerStartTime: this.props.audioContext.currentTime })
        } else if (this.props.keyboard.currentKeys.length === 0 && this.state.triggerStartTime) {
            this.setState({ triggerStartTime: null })
        }
    }


    handleChange (parameter) {
        this.setState(parameter)
    }

    handleOscillatorOneOctaveChange (e) {
        const oscillatorOne = {...this.state.oscillatorOne}
        oscillatorOne.oscillatorOctave = parseInt(e.target.value)
        this.setState({ oscillatorOne })
    }

    handleOscillatorOneDetuneChange (e) {
        const oscillatorOne = {...this.state.oscillatorOne}
        oscillatorOne.oscillatorDetune = parseFloat(e.target.value)
        this.setState({ oscillatorOne })
    }

    handleOscillatorOneWaveformChange (e) {
        const oscillatorOne = {...this.state.oscillatorOne}
        oscillatorOne.oscillatorWaveform = e.target.value
        this.setState({ oscillatorOne })
    }

    handleOscillatorOneGainChange (e) {
        const oscillatorOne = {...this.state.oscillatorOne}
        oscillatorOne.oscillatorGain = parseFloat(e.target.value)
        this.setState({ oscillatorOne })
    }

    handleOscillatorTwoOctaveChange (e) {
        const oscillatorTwo = {...this.state.oscillatorTwo}
        oscillatorTwo.oscillatorOctave = parseInt(e.target.value)
        this.setState({ oscillatorTwo })
    }

    handleOscillatorTwoDetuneChange (e) {
        const oscillatorTwo = {...this.state.oscillatorTwo}
        oscillatorTwo.oscillatorDetune = parseFloat(e.target.value)
        this.setState({ oscillatorTwo })
    }

    handleOscillatorTwoWaveformChange (e) {
        const oscillatorTwo = {...this.state.oscillatorTwo}
        oscillatorTwo.oscillatorWaveform = e.target.value
        this.setState({ oscillatorTwo })
    }

    handleOscillatorTwoGainChange (e) {
        const oscillatorTwo = {...this.state.oscillatorTwo}
        oscillatorTwo.oscillatorGain = parseFloat(e.target.value)
        this.setState({ oscillatorTwo })
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
                <VoiceContainer audioContext={this.props.audioContext} />
                <ControlInterfaceContainer />
                <div>Current Controller: {this.props.controller}</div>
                <div>Use AWSEDFTGYHUJKOLP; keys to play!</div>
            </div>
        )
    }
}