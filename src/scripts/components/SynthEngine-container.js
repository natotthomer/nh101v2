import { connect } from 'react-redux'

import SynthEngine from './SynthEngine'

import { updateGateStartTime } from '../actions/synth-actions'

const mapStateToProps = ({ keyboard, synth }) => ({
    ...keyboard,
    ...synth
})

const mapDispatchToProps = dispatch => ({
    updateGateStartTime: data => dispatch(updateGateStartTime(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(SynthEngine)