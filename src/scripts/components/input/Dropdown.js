import React from 'react'

export default class Dropdown extends React.Component {
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
