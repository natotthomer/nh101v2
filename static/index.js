// var AudioContext = window.AudioContext || window.webkitAudioContext;
// var audioCtx = new AudioContext();

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import AppContainer from './App-container'
import Store from './store'

const initializeApp = () => {
    ReactDOM.render(
        <Provider store={Store()}>
            <AppContainer />
        </Provider>,
        document.getElementById('root')
    )
}

document.addEventListener('DOMContentLoaded', initializeApp)