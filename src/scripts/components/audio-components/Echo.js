import React from 'react'

export default class Echo extends React.Component {
  constructor (props) {
    super(props)

    this.setUpEcho = this.setUpEcho.bind(this)
    this.renderChildren = this.renderChildren.bind(this)

    this.setUpEcho()
  }

  componentDidUpdate (prevProps, prevState) {
    const { echoFeedback, echoTime, echoVolume, echoLFOSpeed, echoLFOAmount, echoLPFFrequency } = this.props.parameterValues
    this.echoVolume.gain.setValueAtTime(echoVolume, this.audioContext.currentTime)
    this.echoFeedback.gain.setValueAtTime(echoFeedback, this.audioContext.currentTime)
    this.echo.delayTime.setValueAtTime(echoTime, this.audioContext.currentTime)
    this.echoLFO.frequency.setValueAtTime(echoLFOSpeed, this.audioContext.currentTime)
    this.echoLFOAmount.gain.setValueAtTime(echoLFOAmount, this.audioContext.currentTime)
    this.echoLPF.frequency.setValueAtTime(echoLPFFrequency, this.audioContext.currentTime)
  }

  setUpEcho () {
    const { audioContext, parameterValues, parentNode } = this.props
    this.audioContext = audioContext

    this.output = this.audioContext.createGain()
    this.echo = this.audioContext.createDelay(10.0) // argument is maxDelayTime
    this.echoVolume = this.audioContext.createGain()
    this.echoFeedback = this.audioContext.createGain()
    this.echoLFO = this.audioContext.createOscillator()
    this.echoLFOAmount = this.audioContext.createGain()
    this.echoLPF = this.audioContext.createBiquadFilter()

    this.echoVolume.gain.value = parameterValues.echoVolume
    this.echo.delayTime.value = parameterValues.echoTime
    this.echoFeedback.gain.value = parameterValues.echoFeedback
    this.echoLFO.frequency.value = parameterValues.echoLFOSpeed
    this.echoLFOAmount.gain.value = parameterValues.echoLFOAmount
    this.echoLPF.frequency.value = parameterValues.echoLPFFrequency

    this.echoLFO.start()
    
    this.echoLFO.connect(this.echoLFOAmount)
    this.echoLFOAmount.connect(this.echo.delayTime)
    this.echo.connect(this.echoFeedback)
    this.echoFeedback.connect(this.echoLPF)
    this.echoLPF.connect(this.echo)
    this.output.connect(this.echo)
    this.echo.connect(this.echoVolume)
    this.echoVolume.connect(this.output)

    this.output.connect(parentNode)
  }

  renderChildren () {
    return React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        parentNode: this.output
      })
    })
  }
  
  render () {
    return (
      <div>
        {this.renderChildren()}
      </div>
    )
  }
}