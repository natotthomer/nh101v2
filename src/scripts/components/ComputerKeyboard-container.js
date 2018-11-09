import { connect } from 'react-redux'

import ComputerKeyboard from './ComputerKeyboard'
import { keyDown, keyUp } from '../actions/keyboard-actions'


const mapStateToProps = ({ keyboard }) => ({
    keyboard
})

const mapDispatchToProps = dispatch => ({
    keyDown: key => dispatch(keyDown(key)),
    keyUp: key => dispatch(keyUp(key)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ComputerKeyboard)