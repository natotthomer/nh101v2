import React from 'react'

import { handleGenericControlChange } from '../../utils'

export default class Checkbox extends React.Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e) {
    handleGenericControlChange(this.props, e.target.checked)
  }
  
  render () {
    return (
      <div className='input-checkbox'>
        <div className='input-checkbox-title'>
          {this.props.title}
        </div>
        <input type='checkbox'
          checked={this.props.value}
          onChange={this.handleChange} />
        <div>{this.props.value}</div>
      </div>
    )
  }
}