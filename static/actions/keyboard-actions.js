import { KEY_DOWN, KEY_UP, GATE_ON, GATE_OFF } from '../constants/keyboard-constants'

export const keyDown = key => dispatch => dispatch({
    type: KEY_DOWN,
    key
})

export const keyUp = key => dispatch => dispatch({
    type: KEY_UP,
    key
})

export const gateOn = () => dispatch => dispatch({
    type: GATE_ON
})

export const gateOff = () => dispatch => dispatch({
    type: GATE_OFF
})