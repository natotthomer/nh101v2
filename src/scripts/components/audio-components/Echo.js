import React from 'react'

export default class Echo extends React.Component {
  constructor (props) {
    super(props)

    this.setUpEcho = this.setUpEcho.bind(this)
    this.renderChildren = this.renderChildren.bind(this)

    this.setUpEcho()
  }

  setUpEcho () {
    this.audioContext = this.props.audioContext
    this.echo = this.audioContext.createDelay()
    this.echo.delayTime.value = 1.5

    this.feedback = this.audioContext.createGain()
    this.feedback.gain.value = 0.8
    
    this.echo.connect(this.feedback)
    this.feedback.connect(this.echo)

    this.echo.connect(this.props.parentNode)
  }

  renderChildren () {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        parentNode: this.echo
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