import { 
  UPDATE_VCO, UPDATE_VCF, UPDATE_VCA, 
  UPDATE_CURRENT_KEY, UPDATE_ECHO
} from '../constants/synth-constants'

export const updateVCO = data => dispatch => dispatch({
  type: UPDATE_VCO,
  data
})

export const updateVCF = data => dispatch => dispatch({
  type: UPDATE_VCF,
  data
})

export const updateVCA = data => dispatch => dispatch({
  type: UPDATE_VCA,
  data
})

export const updateCurrentKey = data => dispatch => dispatch({
  type: UPDATE_CURRENT_KEY,
  data
})

export const updateEcho = data => dispatch => dispatch({
  type: UPDATE_ECHO,
  data
})