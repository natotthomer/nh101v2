import { KEY_DOWN, KEY_UP } from '../constants/keyboard-constants'

export const keyDown = key => dispatch => dispatch({
  type: KEY_DOWN,
  key
})

export const keyUp = key => dispatch => dispatch({
  type: KEY_UP,
  key
})