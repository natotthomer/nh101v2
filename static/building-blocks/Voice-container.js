import { connect } from 'react-redux'

import Voice from './Voice'

const mapStateToProps = ({ keyboard }) => ({
    currentKeys: keyboard.currentKeys,
    gate: keyboard.gate
})

export default connect(mapStateToProps)(Voice)