import { connect } from 'react-redux'

import VCAInterface from './VCAInterface'
import { updateVCA } from '../../actions/synth-actions'

const mapStateToProps = ({  }) => ({})

const mapDispatchToProps = dispatch => ({
  updateVCA: data => dispatch(updateVCA(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(VCAInterface)