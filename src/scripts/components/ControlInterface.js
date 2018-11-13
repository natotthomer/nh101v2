import React from 'react'

import GenericModuleInterface from './building-blocks/GenericModuleInterface'
// import VCFInterface from './building-blocks/VCFInterface'
// import VCAInterface from './building-blocks/VCAInterface'

export default class ControlInterface extends React.Component {
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
        
        
        this.props.updateVCO(parameter)
    }
    
    render () {
        return (
            <div className="main-controls">
                <GenericModuleInterface modules={this.props.vcos} type={'vco'} />
                <GenericModuleInterface modules={this.props.vcf} type={'vcf'} />
            </div>
        )
    }
}