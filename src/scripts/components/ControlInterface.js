import React from 'react'

import GenericModuleInterface from './interface-components/GenericModuleInterface'

const ControlInterface = props => {
  return (
    <div className="main-controls">
      <GenericModuleInterface modules={props.vcos} type={'vco'} />
      <GenericModuleInterface modules={props.vcf} type={'vcf'} />
      <GenericModuleInterface modules={props.vca} type={'vca'} />
      <GenericModuleInterface modules={props.echo} type={'echo'} />
    </div>
  )
}

export default ControlInterface