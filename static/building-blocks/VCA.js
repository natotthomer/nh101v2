import React from 'react'

export default class VCA extends React.Component {
    constructor (props) {
        super(props)

        this.amplifier = this.props.audioContext.createGain()
        this.amplifier.gain.value = 0

        this.setGain = this.setGain.bind(this)
    }

    componentDidUpdate (prevProps, prevState) {
        if (this.props.gate) {
            this.setGain(1)
        } else {
            this.setGain(0)
        }
    }

    setGain (newValue, atTime = this.props.audioContext.currentTime) {
        this.amplifier.gain.setValueAtTime(newValue, atTime)
    }
    
    render () {
        return null
    }
}