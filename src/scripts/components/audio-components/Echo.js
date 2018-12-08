import React from 'react'

export default class Echo extends React.Component {
  constructor (props) {
    super(props)

    this.setUpEcho = this.setUpEcho.bind(this)
    this.renderChildren = this.renderChildren.bind(this)

    this.setUpEcho()
  }

  componentDidUpdate (prevProps, prevState) {
    const { echoFeedback, echoTime, echoVolume } = this.props.moduleParameters
    this.echoVolume.gain.setValueAtTime(echoVolume, this.audioContext.currentTime)
    this.feedback.gain.setValueAtTime(echoFeedback, this.audioContext.currentTime)
    this.echo.delayTime.setValueAtTime(echoTime, this.audioContext.currentTime)
  }

  setUpEcho () {
    const { audioContext, moduleParameters, parentNode } = this.props
    this.audioContext = audioContext

    this.output = this.audioContext.createGain()
    this.echoVolume = this.audioContext.createGain()

    this.echoVolume.gain.value = moduleParameters.echoVolume

    this.echo = this.audioContext.createDelay(10.0)
    this.echo.delayTime.value = moduleParameters.echoTime

    this.feedback = this.audioContext.createGain()
    this.feedback.gain.value = moduleParameters.echoFeedback
    
    this.echo.connect(this.feedback)
    this.feedback.connect(this.echo)

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
        Echo
        {this.renderChildren()}
      </div>
    )
  }
}