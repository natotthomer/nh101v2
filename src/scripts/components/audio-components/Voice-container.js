import { connect } from 'react-redux'

import Voice from './Voice'

const mapStateToProps = ({ keyboard, synth }) => ({
  ...keyboard,
  synth
})

export default connect(mapStateToProps)(Voice)