import { connectAdvanced } from 'react-redux'

import Voice from './Voice'

const mapStateToProps = ({ keyboard, synth }) => ({
  ...keyboard,
  synth
})

export default connectAdvanced(mapStateToProps, { withRef: true })(Voice);