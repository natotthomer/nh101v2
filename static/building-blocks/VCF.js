import React from 'react'

export default class VCF extends React.Component {
    constructor (props) {
        super(props)

        this.filter = this.props.audioContext.createBiquadFilter()
        this.filter.frequency.value = 1000
        this.filter.Q.value = 1.0
    }

    render () {
        return null
    }
}