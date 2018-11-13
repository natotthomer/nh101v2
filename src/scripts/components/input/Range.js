import React from 'react'

import { handleGenericControlChange } from '../../utils'

export default class Range extends React.Component {
    constructor (props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange (e) {
        handleGenericControlChange(this.props, e.target.value)
    }

    render () {
        return (
            <div className='input-range'>
                <div className='input-range-title'>
                    {this.props.title}
                </div>
                <input type='range'
                    min={this.props.min}
                    max={this.props.max}
                    step={this.props.step}
                    value={this.props[this.props.parameter]}
                    onChange={this.handleChange} />
                <div>{this.props.value}</div>
            </div>
        )
    }
}