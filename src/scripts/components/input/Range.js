import React from 'react'

const Range = props => {
    return (
        <div className='input-range'>
            <div className='input-range-title'>
                {props.title}
            </div>
            <input type='range'
                min={props.min}
                max={props.max}
                step={props.step}
                value={props.value}
                onChange={props.handleChange} />
            <div>{props.value}</div>
        </div>
    )
}

export default Range