import React from 'react'

import VCOInterfaceContainer from './VCOInterface-container'

const VCOBankInterface = props => {
  const vcos = props.vcos.map((vco, idx) => {
    return (
      <VCOInterfaceContainer key={idx} id={idx} {...vco}  />
    );
  });
  
  return (
    <React.Fragment>
      {vcos}
    </React.Fragment>
  );
};

export default VCOBankInterface;