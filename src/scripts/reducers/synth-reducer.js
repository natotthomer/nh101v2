import {
  UPDATE_VCO, UPDATE_VCF, UPDATE_VCA, UPDATE_GATE_START_TIME, 
  UPDATE_CURRENT_KEY, UPDATE_RETRIGGER
} from '../constants/synth-constants'

const _nulLSynth = {
  vcos: [
    {
      oscillatorOctave: 4,
      oscillatorDetune: 0,
      oscillatorWaveform: 'sawtooth',
      oscillatorGain: 0.5,
      id: 0
    }, {
      oscillatorOctave: 4,
      oscillatorDetune: 0,
      oscillatorWaveform: 'sawtooth',
      oscillatorGain: 0.0,
      id: 1
    }
  ],
  vcf: {
    frequency: {
      baseValue: 1000,
      attackTime: 1.0,
      decayTime: 1.0,
      sustainLevel: 0.5,
      releaseTime: 0.3,
      envelopeAmount: 1.0,
      range: [20, 20000]
    },
    Q: {
      baseValue: 1.0,
      range: [0.0, 40.0]
    }
  },
  vca: {
    gain: {
      baseValue: 0.0,
      attackTime: 1.0,
      decayTime: 1.0,
      sustainLevel: 0.5,
      releaseTime: 0.3,
      envelopeAmount: 1.0,
      range: [0.0, 1.0]
    }
  },
  controller: 'keyboard',
  currentKey: null,
  gateStartTime: null,
  retrigger: true
}

const SynthReducer = (state = _nulLSynth, action) => {
  switch (action.type) {
    case UPDATE_VCO: {
      const vcos = [...state.vcos]
      const vco = Object.assign({}, vcos[action.data.id])
      vco[action.data.parameter] = action.data.value
      vcos[action.data.id] = vco

      return Object.assign({}, state, { vcos })
    }
    case UPDATE_VCF: {
      const vcf = {...state.vcf}
      vcf[action.data.parameter] = action.data.value

      return Object.assign({}, state, { vcf })
    }
    case UPDATE_VCA: {
      const vca = {...state.vca}
      vca[action.data.parameter] = action.data.value
      
      return Object.assign({}, state, { vca })
    }
    case UPDATE_GATE_START_TIME: {
      const gateStartTime = action.data.value
      
      return Object.assign({}, state, { gateStartTime })
    }
    case UPDATE_CURRENT_KEY: {
      const currentKey = action.data.value
      
      return Object.assign({}, state, currentKey)
    }
    case UPDATE_RETRIGGER: {
      const retrigger = !state.trigger

      return Object.assign({}, state, { retrigger })
    }
    default: 
      return state
  }
}

export default SynthReducer