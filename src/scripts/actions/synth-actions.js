import { 
    UPDATE_VCO, 
    UPDATE_VCF, 
    UPDATE_VCA, 
    UPDATE_GATE_START_TIME, 
    UPDATE_CURRENT_KEY,
    UPDATE_RETRIGGER
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

export const updateGateStartTime = data => dispatch => dispatch({
    type: UPDATE_GATE_START_TIME,
    data
})

export const updateCurrentKey = data => dispatch => dispatch({
    type: UPDATE_CURRENT_KEY,
    data
})

export const updateRetrigger = () => dispatch => dispatch({
    type: UPDATE_RETRIGGER
})