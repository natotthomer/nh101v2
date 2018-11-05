import React, { Component } from 'react'

import { buildCanvas } from '../synth-charts'
import VCO from './VCO'
import VCA from './VCA'
import VCF from './VCF'

export default class Voice extends Component {
    constructor (props) {
        super(props)

        this.vco = null
        this.vcf = null
        this.vca = null
    }
    
    componentDidMount () {
        buildCanvas(this.vca.amplifier)
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
