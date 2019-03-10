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
      parameterValues: synth.vca,
      gateStartTime: gateStartTime
    },
    vcfProps: {
      audioContext: audioContext,
      currentKeys: currentKeys,
      parameterValues: synth.vcf,
      gateStartTime: gateStartTime
    },
    vcoProps: synth.vcos.map(vcoData => ({ 
      audioContext: audioContext,
      currentKeys: currentKeys,
      parameterValues: vcoData 
    })),
    echoProps: {
      audioContext: audioContext,
      currentKeys: currentKeys,
      parameterValues: synth.echo
    }
  }

  const { vcaProps, vcoProps, vcfProps, echoProps } = childrenProps
  
  const vcos = vcoProps.map((vcoData, idx) => <VCO key={idx} {...vcoData} />)
  
  return (
    <React.Fragment>
      <Echo {...echoProps} parentNode={audioContext.destination}>
        <VCA {...vcaProps}>
          <VCF {...vcfProps}>
            {vcos}
          </VCF>
        </VCA>
      </Echo>
    </React.Fragment>
  )
}

export default Voice