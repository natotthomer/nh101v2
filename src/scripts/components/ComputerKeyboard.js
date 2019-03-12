import React, { Component } from 'react'

import { REGISTERED_KEYS } from '../constants/keyboard-constants'

export default class ComputerKeyboard extends Component {
  constructor (props) {
    super(props)

    this.state = {
      audioContextInitialized: false
    };

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  handleKeyDown (event) {
    if (!this.state.hasAudioPermissions) {
      this.props.audioContext.resume();
      this.setState({ hasAudioPermissions: true });
    }

    if (this.props.currentKeys.indexOf(event.keyCode) < 0 && REGISTERED_KEYS.includes(event.keyCode)) {
      this.props.keyDown(event.keyCode)
      this.props.updateGateStartTime({ value: this.props.audioContext.currentTime })
    }

    if (!this.state.audioContextInitialized) {
      this.props.audioContext.resume().then(() => {
        this.setState({ audioContextInitialized: true });
      });
    }
  }

  handleKeyUp (e) {
    const isLastKey = this.props.currentKeys.includes(e.keyCode) && this.props.currentKeys.length === 1
    if (isLastKey && this.props.gateStartTime) {
      this.props.updateGateStartTime({ value: null })
    }
    if (this.props.currentKeys.includes(e.keyCode) && REGISTERED_KEYS.includes(e.keyCode)) {
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