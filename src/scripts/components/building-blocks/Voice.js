import React, { Component } from 'react'

import VCO from './VCO'
import VCA from './VCA'
import VCF from './VCF'
import AudioAnalyser from '../audio-analysis/AudioAnalyser'

export default class Voice extends Component {
    constructor (props) {
        super(props)

        this.state = {
            _isMounted: false
        }

        this.vcoOne = null
        this.vcoTwo = null
        this.vcoOneGain = props.audioContext.createGain()
        this.vcoTwoGain = props.audioContext.createGain()
        this.vcoMixer = props.audioContext.createGain()
        this.vcf = null
        this.vca = null
    }
    
    componentDidMount () {
        this.vcoOne.oscillator.connect(this.vcoOneGain)
        this.vcoTwo.oscillator.connect(this.vcoTwoGain)

        this.vcoOneGain.gain.setValueAtTime(0.5, this.props.audioContext.currentTime)
        this.vcoTwoGain.gain.setValueAtTime(0.5, this.props.audioContext.currentTime)

        this.vcoOneGain.connect(this.vcoMixer)
        this.vcoTwoGain.connect(this.vcoMixer)

        this.vcoMixer.connect(this.vcf.output)
        this.vcf.output.connect(this.vca.amplifier)
        this.vca.amplifier.connect(this.props.audioContext.destination)
        this.setState({ _isMounted: true })
    }
    
    componentDidUpdate (prevProps, prevState) {
        if (this.props.synth.vcos[0].oscillatorGain !== prevProps.synth.vcos[0].oscillatorGain) {
            this.vcoOneGain.gain.setValueAtTime(this.props.synth.vcos[0].oscillatorGain, this.props.audioContext.currentTime)
        } else if (this.props.synth.vcos[1].oscillatorGain !== prevProps.synth.vcos[1].oscillatorGain) {
            this.vcoTwoGain.gain.setValueAtTime(this.props.synth.vcos[1].oscillatorGain, this.props.audioContext.currentTime)

        }
    }

    render () {
        return (
            <React.Fragment>
                <React.Fragment>
                    <VCO ref={vcoOne => (this.vcoOne = vcoOne)}
                        {...this.props.synth.vcos[0]} 
                        currentKeys={this.props.currentKeys}
                        audioContext={this.props.audioContext} />
                    <VCO ref={vcoTwo => (this.vcoTwo = vcoTwo)}
                        {...this.props.synth.vcos[1]} 
                        currentKeys={this.props.currentKeys}
                        audioContext={this.props.audioContext} />
                    <AudioAnalyser 
                        audioContext={this.props.audioContext}
                        input={this.vcoMixer} 
                        output={this.state._isMounted ? this.vcf.filter : null} />
                </React.Fragment>
                <VCF ref={vcf => (this.vcf = vcf)}
                    {...this.props.synth.vcf} audioContext={this.props.audioContext} />
                <VCA ref={vca => (this.vca = vca)}
                    currentKeys={this.props.currentKeys}
                    {...this.props.synth.vca} audioContext={this.props.audioContext} />
            </React.Fragment>
        )
    }
}
