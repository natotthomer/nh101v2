import {
  UPDATE_VCO, UPDATE_VCF, UPDATE_VCA, 
  UPDATE_CURRENT_KEY, UPDATE_ECHO, RESPONSE_TYPES
} from '../constants/synth-constants'

const _synthBaseState = {
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
    }, {
      oscillatorOctave: 4,
      oscillatorDetune: 0,
      oscillatorWaveform: 'sawtooth',
      oscillatorGain: 0.0,
      id: 2
    }
  ],
  vcf: {
    frequency: {
      baseValue: 2000,
      attackTime: 1.0,
      decayTime: 1.0,
      sustainLevel: 0.5,
      releaseTime: 0.3,
      envelopeAmount: 1.0,
      range: [20, 20000],
      envelopeResponseType: RESPONSE_TYPES[0],
      envelopeRetrigger: true
    },
    Q: {
      baseValue: 1.0,
      range: [0.0, 40.0]
    }
  },
  vca: {
    gain: {
      baseValue: 0.000001,
      attackTime: 1.0,
      decayTime: 1.0,
      sustainLevel: 0.5,
      releaseTime: 0.3,
      envelopeAmount: 1.0,
      range: [0.0, 1.0],
      envelopeResponseType: RESPONSE_TYPES[0],
      envelopeRetrigger: true
    }
  },
  echo: {
    echoVolume: 0.0,
    echoFeedback: 0.0,
    echoTime: 0.5,
    echoLFOSpeed: 0.5,
    echoLFOAmount: 0.0,
    echoLPFFrequency: 1000
  },
  controller: 'keyboard',
  currentKey: null,
}

const SynthReducer = (state = _synthBaseState, action) => {
  switch (action.type) {
    case UPDATE_VCO: {
      return {
        ...state,
        vcos: [
          ...state.vcos.map((vco, idx) => {
            console.log(vco)
            if (idx === action.data.id) {
              const result = {
                ...state.vcos[idx],
                [action.data.parameter]: action.data.value
              }
              console.log(result)
              return result
            }
            return vco
          })
        ]
      }
    }
    case UPDATE_VCF: {
      return {
        ...state,
        vcf: {
          ...state.vcf,
          [action.data.audioParam]: {
            ...state.vcf[action.data.audioParam],
            [action.data.parameter]: action.data.value
          }
        }
      }
    }
    case UPDATE_VCA: {
      return {
        ...state,
        vca: {
          ...state.vca,
          [action.data.audioParam]: {
            ...state.vca[action.data.audioParam],
            [action.data.parameter]: action.data.value
          }
        }
      }
    }
    case UPDATE_CURRENT_KEY: {
      const currentKey = action.data.value
      
      return Object.assign({}, state, currentKey)
    }
    case UPDATE_ECHO: {
      const echo = {...state.echo}
      echo[action.data.parameter] = action.data.value
      return Object.assign({}, state, { echo: {...echo} })
    }
    default: 
      return state
  }
}

export default SynthReducer