import { connect } from 'react-redux'

import Voice from './Voice'

const mapStateToProps = ({ keyboard, synth }) => ({
  currentKeys: keyboard.currentKeys,
  synth
})

export default connect(mapStateToProps)(Voice)