import { connect } from 'react-redux';

import VoiceAllocator from './VoiceAllocator';

const mapStateToProps = ({ synth, keyboard }) => ({
  voices: synth.voices,
  currentKeys: keyboard.currentKeys
});

export default connect(mapStateToProps)(VoiceAllocator);