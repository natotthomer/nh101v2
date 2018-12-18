import { KEY_DOWN, KEY_UP, UPDATE_GATE_START_TIME } from '../constants/keyboard-constants'

export const keyDown = key => dispatch => dispatch({
  type: KEY_DOWN,
  key
})

export const keyUp = key => dispatch => dispatch({
  type: KEY_UP,
  key
})

export const updateGateStartTime = data => dispatch => dispatch({
  type: UPDATE_GATE_START_TIME,
  data
})