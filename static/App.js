import React, { Component } from 'react'

import audioContext from './audio-context'
import ComputerKeyboardContainer from './ComputerKeyboard-container'
import SynthEngineContainer from './SynthEngine-container'

export default class App extends Component {
    render () {
        return (
            <div>
                <SynthEngineContainer audioContext={audioContext} />
                <ComputerKeyboardContainer />
            </div>
        )
    }
}