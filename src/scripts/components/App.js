import React, { Component } from 'react'

import audioContext from '../audio-context'
import ComputerKeyboardContainer from './ComputerKeyboard-container'
import SynthEngineContainer from './SynthEngine-container'
import Head from './Head'

export default class App extends Component {
    render () {
        return (
            <React.Fragment>
                <Head />
                <SynthEngineContainer audioContext={audioContext} />
                <ComputerKeyboardContainer />
            </React.Fragment>
        )
    }
}