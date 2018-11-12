import React from 'react'

import VCOBankInterface from './VCOBankInterface'
import VCFInterface from './VCFInterface'
// import VCAInterface from './VCAInterface'

const GenericModuleInterface = props => {
    let modules

    switch (props.type) {
        case 'vco': {
            modules = <VCOBankInterface vcos={props.modules} />
            break
        }
        case 'vca': {
            modules = <VCAInterface vcf={props.modules} />
            break
        }
        case 'vcf': {
            modules = <VCFInterface vca={props.modules} />
            break
        }
        default: {}
    }

    return (
        <div className="module" id={`${props.type}-controls`}>
            <div className="module-title">{props.type.toUpperCase()}</div>
                <div className="module-controls">
                    {modules}
                </div>
        </div>
    )
}

export default GenericModuleInterface