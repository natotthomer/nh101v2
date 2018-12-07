import React from 'react'

import Envelope from './Envelope'

export default class VCA extends React.Component {
    constructor (props) {
        super(props)

        this._setUpAmplifier = this._setUpAmplifier.bind(this)

        this._setUpAmplifier()
    }

    

    _setUpAmplifier () {
        this.audioContext = this.props.audioContext
        this.amplifier = this.audioContext.createGain()
        this.amplifier.gain.value = 0
        this.amplifier.connect(this.audioContext.destination)
    }
    
    render () {
        return (
            <Envelope param={this.amplifier.gain} {...this.props} />
        )
    }
}