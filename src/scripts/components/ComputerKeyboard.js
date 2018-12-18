import React, { Component } from 'react'

import { REGISTERED_KEYS } from '../constants/keyboard-constants'

export default class ComputerKeyboard extends Component {
  constructor (props) {
    super(props)

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  handleKeyDown (e) {
    if (this.props.currentKeys.indexOf(e.keyCode) < 0 && REGISTERED_KEYS.includes(e.keyCode)) {
      this.props.keyDown(e.keyCode)
      this.props.updateGateStartTime({ value: this.props.audioContext.currentTime })
    }
  }

  handleKeyUp (e) {
    if (this.props.currentKeys.length === 0 && this.props.gateStartTime) {
      this.props.updateGateStartTime({ value: null })
    }
    if (this.props.currentKeys.indexOf(e.keyCode) >= 0 && REGISTERED_KEYS.includes(e.keyCode)) {
      this.props.keyUp(e.keyCode)
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
    return null
  }
}