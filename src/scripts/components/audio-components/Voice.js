import React, { Component } from 'react'

import VCO from './VCO'
import VCA from './VCA'
import VCF from './VCF'
import AudioAnalyser from './audio-analysis/AudioAnalyser'

export default class Voice extends Component {
    constructor (props) {
        super(props)


    }

    render () {
        console.log(this.props)
        const vcaProps = {
            audioContext: this.props.audioContext,
            currentKeys: this.props.currentKeys,
            synth: this.props.synth
        }
        return (
            <React.Fragment>
                <VCA {...vcaProps} />
            </React.Fragment>
        )
    }
}
