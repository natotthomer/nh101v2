import {
    KEY_DOWN, KEY_UP, GATE_ON, GATE_OFF
} from '../constants/keyboard-constants'
    
const _nullKeyboard = {
    currentKeys: [],
    gate: false
}
  
const KeyboardReducer = (state = _nullKeyboard, action) => {
    switch (action.type) {
        case KEY_DOWN: {
            const currentKeys = state.currentKeys
            currentKeys.push(action.key)
            return Object.assign({}, state, { currentKeys })
        }
        case KEY_UP: {
            const currentKeys = state.currentKeys
            const indexOfKey = state.currentKeys.indexOf(action.key)
            currentKeys.splice(indexOfKey, 1)
            return Object.assign({}, state, { currentKeys })
        }
        case GATE_ON: {
            return Object.assign({}, state, { gate: true })
        }
        case GATE_OFF: {
            return Object.assign({}, state, { gate: false })
        }
        default:
            return state
    }
}
  
export default KeyboardReducer
  