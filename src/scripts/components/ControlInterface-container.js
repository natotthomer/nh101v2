import { connect } from 'react-redux'

import ControlInterface from './ControlInterface'

const mapStateToProps = ({ synth }) => ({
    ...synth
})

export default connect(mapStateToProps)(ControlInterface)