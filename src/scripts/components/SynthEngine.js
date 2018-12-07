import React, { Component } from 'react'

import VoiceContainer from './audio-components/Voice-container'
import ControlInterfaceContainer from './ControlInterface-container'

export default class SynthEngine extends Component {
    componentDidUpdate (prevProps, prevState) {
        if (this.props.currentKeys.length !== prevProps.currentKeys.length) {
            this.props.updateGateStartTime({ value: this.props.audioContext.currentTime })
        } else if (this.props.currentKeys.length === 0 && this.props.gateStartTime) {
            this.props.updateGateStartTime({ value: null })
        }
    }

    render () {
        return (
            <div style={{ height: '100%', width: '100%' }}>
                <VoiceContainer audioContext={this.props.audioContext} />
                <ControlInterfaceContainer />
                <div>Current Controller: {this.props.controller}</div>
                <div>Use AWSEDFTGYHUJKOLP; keys to play!</div>
            </div>
        )
    }
}