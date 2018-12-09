import React, { Component } from 'react'

import VCO from './VCO'
import VCA from './VCA'
import VCF from './VCF'
import Echo from './Echo'

const Voice = props => {
  const { audioContext, currentKeys, synth, gateStartTime } = props
  
  const childrenProps = {
    vcaProps: { 
      audioContext: audioContext,
      currentKeys: currentKeys,
      moduleParameters: synth.vca,
      retrigger: synth.retrigger,
      gateStartTime: gateStartTime
    },
    vcfProps: {
      audioContext: audioContext,
      currentKeys: currentKeys,
      moduleParameters: synth.vcf,
      retrigger: synth.retrigger,
      gateStartTime: gateStartTime
    },
    vcoProps: synth.vcos.map(vcoData => ({ 
      audioContext: audioContext,
      currentKeys: currentKeys,
      moduleParameters: vcoData 
    })),
    echoProps: {
      audioContext: audioContext,
      currentKeys: currentKeys,
      moduleParameters: synth.echo
    }
  }

  const { vcaProps, vcoProps, vcfProps, echoProps } = childrenProps
  
  return (
    <React.Fragment>
      <Echo {...echoProps} parentNode={audioContext.destination}>
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

export default Voice