import { connect } from 'react-redux'

import EchoInterface from './EchoInterface'
import { updateEcho } from '../../actions/synth-actions'

const mapStateToProps = ({  }) => ({})

const mapDispatchToProps = dispatch => ({
  updateEcho: data => dispatch(updateEcho(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(EchoInterface)