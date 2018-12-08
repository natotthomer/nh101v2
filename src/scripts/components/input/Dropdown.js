import React from 'react'

import { handleGenericControlChange } from '../../utils'

export default class Dropdown extends React.Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e) {
    handleGenericControlChange(this.props, e.target.value)
  }

  render () {
    const options = this.props.options.map((option, idx) => {
      return <option key={idx} value={option}>{option}</option>
    })
    
    return (
      <div className='input-dropdown'>
        <div className='input-dropdown-title'>
          {this.props.title}
        </div>
        <select onChange={this.handleChange} value={this.props.value}>
          {options}
        </select>
      </div>
    )
  }
}
