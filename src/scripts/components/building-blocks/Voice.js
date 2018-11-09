import React, { Component } from 'react'

import VCO from './VCO'
import VCA from './VCA'
import VCF from './VCF'
import AudioAnalyser from '../AudioAnalyser'

export default class Voice extends Component {
    constructor (props) {
        super(props)

        this.state = {
            _isMounted: false
        }

        this.vco = null
        this.vcoMixer = props.audioContext.createGain()
        this.vcf = null
        this.vca = null
    }
    
    componentDidMount () {
        this.vco.oscillator.connect(this.vcoMixer)
        this.vcoMixer.connect(this.vcf.filter)
        this.vcf.filter.connect(this.vca.amplifier)
        this.vca.amplifier.connect(this.props.audioContext.destination)
        this.setState({ _isMounted: true })
    }

    render () {
        // <div id="chartContainer" style={{ height: "300px", width: "100%" }}></div>
        // <Visualizer />
        return (
            <React.Fragment>
                <React.Fragment>
                    <VCO ref={vco => (this.vco = vco)}
                        {...this.props} />
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
