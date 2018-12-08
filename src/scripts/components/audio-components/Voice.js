import React, { Component } from 'react'

import VCO from './VCO'
import VCA from './VCA'
import VCF from './VCF'
import Echo from './Echo'

export default class Voice extends Component {
  render () {
    const { audioContext, currentKeys, synth } = this.props
    
    const childrenProps = {
      vcaProps: { 
        audioContext: audioContext,
        currentKeys: currentKeys,
        moduleParameters: synth.vca,
        retrigger: synth.retrigger
      },
      vcfProps: {
        audioContext: audioContext,
        currentKeys: currentKeys,
        moduleParameters: synth.vcf
      },
      vcoProps: synth.vcos.map(vcoData => ({ 
        audioContext: audioContext,
        currentKeys: currentKeys,
        moduleParameters: vcoData 
      }))
    }

    const { vcaProps, vcoProps, vcfProps } = childrenProps
    
    return (
      <React.Fragment>
        <Echo audioContext={audioContext} parentNode={audioContext.destination}>
          <VCA {...vcaProps}>
            <VCF {...vcfProps}>
              <VCO {...vcoProps[0]} />
              <VCO {...vcoProps[1]} />
            </VCF>
          </VCA>
        </Echo>
      </React.Fragment>
    )
  }
}
