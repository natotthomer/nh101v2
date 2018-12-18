import { connect } from 'react-redux'

import VCOInterface from './VCOInterface'
import { updateVCO } from '../../actions/synth-actions'

const mapStateToProps = ({ }) => ({})

const mapDispatchToProps = dispatch => ({
  updateVCO: data => dispatch(updateVCO(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(VCOInterface)