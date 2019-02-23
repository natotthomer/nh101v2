import {
  KEY_DOWN, KEY_UP, UPDATE_GATE_START_TIME
} from '../constants/keyboard-constants'

const _keyboardBaseState = {
  currentKeys: [],
  gateStartTime: null,
}
  
const KeyboardReducer = (state = _keyboardBaseState, action) => {
  switch (action.type) {
    case KEY_DOWN: {
      return {
        ...state,
        currentKeys: [...state.currentKeys, action.key]
      }
    }
    case KEY_UP: {
      return {
        ...state,
        currentKeys: state.currentKeys.filter(key => key !== action.key)
      }
    }
    case UPDATE_GATE_START_TIME: {
      const gateStartTime = action.data.value
      
      return {
        ...state,
        gateStartTime
      }
    }
    default:
      return state
  }
}

export default KeyboardReducer