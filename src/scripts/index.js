import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import AppContainer from './components/App-container'
import Store from './store'

import '../styles/index.scss'

const initializeApp = () => {
    ReactDOM.render(
        <Provider store={Store()}>
            <AppContainer />
        </Provider>,
        document.getElementById('root')
    )
}

document.addEventListener('DOMContentLoaded', initializeApp)