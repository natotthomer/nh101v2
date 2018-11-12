import { UPDATE_VCO, UPDATE_VCF, UPDATE_VCA } from '../constants/synth-constants'

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