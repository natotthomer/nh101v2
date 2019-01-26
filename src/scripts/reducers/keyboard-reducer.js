import {
  KEY_DOWN, KEY_UP, UPDATE_GATE_START_TIME
} from '../constants/keyboard-constants'

const _nullKeyboard = {
  currentKeys: [],
  gateStartTime: null,
}
  
const KeyboardReducer = (state = _nullKeyboard, action) => {
  switch (action.type) {
    case KEY_DOWN: {
      const currentKeys = [...state.currentKeys]
      currentKeys.push(action.key)
      return Object.assign({}, state, { currentKeys })
    }
    case KEY_UP: {
      const currentKeys = [...state.currentKeys]
      const indexOfKey = state.currentKeys.indexOf(action.key)
      currentKeys.splice(indexOfKey, 1)
      return Object.assign({}, state, { currentKeys })
    }
    case UPDATE_GATE_START_TIME: {
      console.log(action.data.value)
      const gateStartTime = action.data.value
      
      return Object.assign({}, state, { gateStartTime })
    }
    default:
      return state
  }
}
  
export default KeyboardReducer
  