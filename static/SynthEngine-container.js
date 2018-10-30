import { connect } from 'react-redux'

import SynthEngine from './SynthEngine'

const mapStateToProps = ({ keyboard }) => ({
    keyboard
})

export default connect(mapStateToProps)(SynthEngine)