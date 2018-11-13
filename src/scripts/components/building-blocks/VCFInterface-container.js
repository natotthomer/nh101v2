import { connect } from 'react-redux'

import VCFInterface from './VCFInterface'
import { updateVCF } from '../../actions/synth-actions'

const mapStateToProps = ({  }) => ({})

const mapDispatchToProps = dispatch => ({
    updateVCF: data => dispatch(updateVCF(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(VCFInterface)