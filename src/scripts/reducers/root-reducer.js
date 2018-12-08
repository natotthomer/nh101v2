import { combineReducers } from 'redux'

import KeyboardReducer from './keyboard-reducer'
import SynthReducer from './synth-reducer'

export default combineReducers({
  keyboard: KeyboardReducer,
  synth: SynthReducer
})
