import React from 'react'

import VCOBankInterface from './VCOBankInterface'
import VCFInterfaceContainer from './VCFInterface-container'
import VCAInterfaceContainer from './VCAInterface-container'

const GenericModuleInterface = props => {
  let modules

  switch (props.type) {
    case 'vco': {
      modules = <VCOBankInterface vcos={props.modules} />
      break
    }
    case 'vcf': {
      modules = <VCFInterfaceContainer vcf={props.modules} />
      break
    }
    case 'vca': {
      modules = <VCAInterfaceContainer vca={props.modules} />
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