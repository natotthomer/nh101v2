import React, { Component } from 'react'

import VoiceContainer from './audio-components/Voice-container'
import ControlInterfaceContainer from './ControlInterface-container'
import VoiceAllocatorContainer from './audio-components/VoiceAllocator-container';

export default class SynthEngine extends Component {
  // componentDidUpdate (prevProps, prevState) {
  //   if (this.props.currentKeys.length !== prevProps.currentKeys.length) {
  //     this.props.updateGateStartTime({ value: this.props.audioContext.currentTime })
  //   } else if (this.props.currentKeys.length === 0 && this.props.gateStartTime) {
  //     this.props.updateGateStartTime({ value: null })
  //   }
  // }

  render () {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <div style={{ display: 'flex' }}>
          <div id="filter-chart" style={{ height: "200px", width: "50%" }} />
          <div id="amp-chart" style={{ height: "200px", width: "50%" }} />
        </div>
        <VoiceAllocatorContainer audioContext={this.props.audioContext} />
        {/* <VoiceContainer audioContext={this.props.audioContext} /> */}
        <ControlInterfaceContainer />
        <div>Current Controller: {this.props.controller}</div>
        <div>Use AWSEDFTGYHUJKOLP; keys to play!</div>
      </div>
    )
  }
}