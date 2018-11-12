import React from 'react'

import Range from '../input/Range'

export default class Envelope extends React.Component {
    constructor (props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange (e) {
        let name = e.target.getAttribute('data-input-name')
        const valueType = e.target.getAttribute('data-input-value-type')
        const parameter = {}
        switch (valueType) {
            case 'float': {
                parameter[name] = parseFloat(e.target.value)
                break
            }
            case 'integer': {
                parameter[name] = parseInt(e.target.value)
                break
            }
            case 'string': {
                parameter[name] = e.target.value
            }
        }
        
        this.props.handleChange(parameter)
    }

    render () {
        return (
            <div className="module-controls-column">
                <Range title="Attack"
                    inputName={this.props.name + '-attack'}
                    valueType={'float'}
                    min={0.001}
                    max={10.0}
                    step={0.001}
                    value={this.props.attackTime}
                    handleChange={this.handleChange} />
                <Range title="Decay"
                    inputName={this.props.name + '-decay'}
                    min={0.001}
                    max={10.0}
                    step={0.001}
                    value={this.props.decayTime}
                    handleChange={this.handleChange} />
                <Range title="Sustain"
                    inputName={this.props.name + '-sustain'}
                    min={0.001}
                    max={1.0}
                    step={0.001}
                    value={this.props.sustainLevel}
                    handleChange={this.handleChange} />
                <Range title="Release"
                    inputName={this.props.name + '-release'}
                    min={0.001}
                    max={10.0}
                    step={0.001}
                    value={this.props.releaseTime}
                    handleChange={this.handleChange} />
            </div>
        )
        
    }
}