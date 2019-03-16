import { connect } from 'react-redux'

import Voice from './Voice'

const mapStateToProps = ({ synth }) => ({
  synth
})

const mergeProps = (propsFromState, propsFromDispatch, passedProps) => {
  return {
    ...propsFromState,
    ...passedProps
  }
}

export default connect(mapStateToProps, null, mergeProps, { withRef: true })(Voice);