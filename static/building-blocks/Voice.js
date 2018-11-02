import React, { Component } from 'react'

import VCO from './VCO'
import VCA from './VCA'
import VCF from './VCF'

export default class Voice extends Component {
    componentDidMount () {
        this.vco.oscillator.connect(this.vcf.filter)
        this.vcf.filter.connect(this.vca.amplifier)
        this.vca.amplifier.connect(this.props.audioContext.destination)
    }

    render () {
        return (
            <React.Fragment>
                <VCO ref={vco => (this.vco = vco)}
                    audioContext={this.props.audioContext}
                    currentKeys={this.props.currentKeys}
                    octave={this.props.octave} />
                <VCF ref={vcf => (this.vcf = vcf)}
                    audioContext={this.props.audioContext}
                    gate={this.props.gate} />
                <VCA ref={vca => (this.vca = vca)}
                    audioContext={this.props.audioContext}
                    gate={this.props.gate} />
            </React.Fragment>
        )
    }
}
