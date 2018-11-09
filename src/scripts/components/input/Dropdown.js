import React from 'react'

const Range = props => {
    const options = props.options.map((option, idx) => {
        return <option key={idx} value={option}>{option}</option>
    })
    
    return (
        <div className='input-dropdown'>
            <div className='input-dropdown-title'>
                {props.title}
            </div>
            <select onChange={props.handleChange} value={props.value}>
                {options}
            </select>
        </div>
    )
}

export default Range