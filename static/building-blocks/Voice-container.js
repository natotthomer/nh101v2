import { connect } from 'react-redux'

import Voice from './Voice'

const mapStateToProps = ({ keyboard }) => ({
    currentKeys: keyboard.currentKeys
})

export default connect(mapStateToProps)(Voice)