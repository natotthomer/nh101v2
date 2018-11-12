import React from 'react'

export default class Range extends React.Component {
    constructor (props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange (e) {        
        const data = {
            parameter: this.props.parameter
        }

        isNaN(this.props.id) ? data.id = null : data.id = this.props.id
        switch (this.props.valueType) {
            case 'float': {
                data.value = parseFloat(e.target.value)
                break
            }
            case 'integer': {
                data.value = parseInt(e.target.value)
                break
            }
            case 'string': {
                data.value = e.target.value
            }
        }
        
        this.props.handleChange(data)
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