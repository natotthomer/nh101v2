import React, { Component } from 'react'

import { REGISTERED_KEYS } from './constants/keyboard-constants'

export default class ComputerKeyboard extends Component {

    constructor (props) {
        super(props)

        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
    }

    handleKeyDown (e) {
        if (this.props.keyboard.currentKeys.indexOf(e.keyCode) < 0 && REGISTERED_KEYS.includes(e.keyCode)) {
            this.props.keyDown(e.keyCode)
            this.props.gateOn()
        }
    }

    handleKeyUp (e) {
        const numberOfKeys = this.props.keyboard.currentKeys.length
        this.props.keyUp(e.keyCode)
        if (numberOfKeys === 1) {
            this.props.gateOff()
        }
    }

    componentDidMount () {
        document.addEventListener('keydown', this.handleKeyDown)
        document.addEventListener('keyup', this.handleKeyUp)
    }

    componentWillUnmount () {
        document.removeEventListener('keydown', this.handleKeyDown)
        document.removeEventListener('keyup', this.handleKeyUp)
    }
    
    render () {
        let keys = this.props.keyboard.currentKeys.map((key, idx) => {
            return (
                <div key={idx}>{key}</div>
            )
        })

        return(
            <div>Keys: {keys}</div>
        )
    }
}