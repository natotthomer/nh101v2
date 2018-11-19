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
        this.waveshaperOne = props.audioContext.createWaveShaper()
        this.waveshaperTwo = props.audioContext.createWaveShaper()

        this.buildWaveShaperCurve = this.buildWaveShaperCurve.bind(this)
    }

    buildWaveShaperCurve (numSamples) {
        const curve = new Float32Array(numSamples)

        const oneEighth = numSamples / 8
        
        for (let i = 0; i < numSamples; i++) {
            if (i < oneEighth) {
                curve[i] = -1
            } else if (i >= numSamples - oneEighth) {
                curve[i] = 1
            } else {
                curve[i] = -1 + ((2 / (numSamples - (oneEighth * 2)))) * (i - 256)
            }
            curve[i] = curve[i] - (Math.pow(curve[i], 3) / 3)
            console.log(curve[i])
        }

        return curve
    }
    
    componentDidMount () {
        this.waveshaperOne.curve = this.buildWaveShaperCurve(2048)
        // this.waveshaperTwo.curve = this.buildWaveShaperCurve(2048)

        this.vcoOne.oscillator.connect(this.vcoOneGain)
        this.vcoTwo.oscillator.connect(this.vcoTwoGain)

        this.vcoOneGain.gain.setValueAtTime(0.5, this.props.audioContext.currentTime)
        this.vcoTwoGain.gain.setValueAtTime(0.5, this.props.audioContext.currentTime)

        this.vcoOneGain.connect(this.vcoMixer)
        this.vcoTwoGain.connect(this.vcoMixer)

        this.vcoMixer.connect(this.vcf.output)
        this.vcf.output.connect(this.waveshaperOne)
        this.waveshaperOne.connect(this.vca.amplifier)

        this.vca.amplifier.connect(this.props.audioContext.destination)
        this.setState({ _isMounted: true })
    }
    
    componentDidUpdate (prevProps, prevState) {
        if (this.props.oscillatorOne.oscillatorGain !== prevProps.oscillatorOne.oscillatorGain) {
            this.vcoOneGain.gain.setValueAtTime(this.props.oscillatorOne.oscillatorGain, this.props.audioContext.currentTime)
        } else if (this.props.oscillatorTwo.oscillatorGain !== prevProps.oscillatorTwo.oscillatorGain) {
            this.vcoTwoGain.gain.setValueAtTime(this.props.oscillatorTwo.oscillatorGain, this.props.audioContext.currentTime)
        }
    }

    render () {
        return (
            <React.Fragment>
                <React.Fragment>
                    <VCO ref={vcoOne => (this.vcoOne = vcoOne)}
                        {...this.props.oscillatorOne} 
                        currentKeys={this.props.currentKeys}
                        audioContext={this.props.audioContext} />
                    <VCO ref={vcoTwo => (this.vcoTwo = vcoTwo)}
                        {...this.props.oscillatorTwo} 
                        currentKeys={this.props.currentKeys}
                        audioContext={this.props.audioContext} />
                    <AudioAnalyser 
                        audioContext={this.props.audioContext}
                        input={this.vcoMixer} 
                        output={this.state._isMounted ? this.vcf.filter : null} />
                </React.Fragment>
                <VCF ref={vcf => (this.vcf = vcf)}
                    {...this.props} />
                <VCA ref={vca => (this.vca = vca)}
                    {...this.props} />
            </React.Fragment>
        )
    }
}
