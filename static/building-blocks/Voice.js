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
                    {...this.props} />
                <VCF ref={vcf => (this.vcf = vcf)}
                    {...this.props} />
                <VCA ref={vca => (this.vca = vca)}
                    {...this.props} />
            </React.Fragment>
        )
    }
}
