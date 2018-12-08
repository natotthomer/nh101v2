import { connect } from 'react-redux'

import App from './App'
import { keyDown, keyUp } from '../actions/keyboard-actions'

const mapStateToProps = ({ keyboard }) => ({
  keyboard
})

const mapDispatchToProps = dispatch => ({
  keyDown: key => dispatch(keyDown(key)),
  keyUp: key => dispatch(keyUp(key))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)