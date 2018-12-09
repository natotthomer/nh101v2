import React from 'react'

import { handleGenericControlChange } from '../../utils'

export default class Range extends React.Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  // componentDidUpdate (prevProps, prevState) {
  //   console.log(this.props.value)
  //   console.log(prevProps.value)
  // }

  handleChange (e) {
    console.log(this.props)
    handleGenericControlChange(this.props, e.target.value)
  }
  
  render () {
    // console.log(this.props.value)
    return (
      <div className='input-range'>
        <div className='input-range-title'>
          {this.props.title}
        </div>
        <input type='range'
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          value={this.props.value}
          onChange={this.handleChange} />
        <div>{this.props.value}</div>
      </div>
    )
  }
}