import React from 'react'

export default class VCA extends React.Component {
    constructor (props) {
        super(props)

        this.amplifier = this.props.audioContext.createGain()
        this.amplifier.gain.setValueAtTime(0, this.props.audioContext.currentTime)
    }

    componentDidUpdate (prevProps, prevState) {
        if (this.props.gate) {
            this.amplifier.gain.setValueAtTime(1, this.props.audioContext.currentTime)
        } else {
            this.amplifier.gain.setValueAtTime(0, this.props.audioContext.currentTime)
        }
    }
    
    render () {
        return null
    }
}