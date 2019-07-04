'use strict'

/* global $ */
import PropTypes from 'prop-types'
import React from 'react'
import uuid from 'uuid'

import PatternLockLib from 'patternlock'
import 'patternlock/dist/patternlock.css'

import './styles.scss'

/**
* This React component XXXX
*
* @hideconstructor
* @memberof module:Asterism
* @public
*/
class PatternLock extends React.Component {
  /**
   * React properties to use on this component.
   *
   * @property {object} theme - The asterism theme object. Often available from the parent component, or in the mainState object of a context.
   * @property {number} animationLevel - The asterism main parameter for visual animations. Often available from the parent component, or in the mainState object of a context.
   * @property {func} patternCallback - The callback method with the pattern once drawn correctly. The pattern is given as parameter, with digits separated by '-'
   * @public
   */
  static propTypes = {
    theme: PropTypes.object.isRequired,
    animationLevel: PropTypes.number.isRequired,
    patternCallback: PropTypes.func.isRequired,
    patternMinLength: PropTypes.number,
    allowRepeat: PropTypes.boolean
  }

  /**
   * Default properties values.
   * @property {number} patternMinLength - 2
   * @property {boolean} allowRepeat - true
   * @public
   */
  static defaultProps = {
    patternMinLength: 2,
    allowRepeat: true
  }

  constructor (props) {
    super(props)
    this.state = {}
    this._id = `patternLock_${uuid.v4()}`
    this.lock = null
  }

  componentDidMount () {
    const height = $(`#${this._id}`).parent().height()
    this.lock = new PatternLockLib(`#${this._id}`, {
      lineOnMove: true,
      allowRepeat: this.props.allowRepeat,
      enableSetPattern: false,
      delimiter: '-',
      radius: height / 14,
      margin: height / 14,
      matrix: [3, 3],
      onDraw: this.onDraw
    })
  }

  componentWillUnmount () {
    this.lock = null
  }

  render () {
    // const { animationLevel, theme } = this.props

    return (
      <div className='patternLock'>
        <div id={this._id} />
      </div>
    )
  }

  onDraw (pattern) {
    const patternArray = pattern.split('-')
    if (patternArray.length < this.props.patternMinLength) {
      this._errorTimer = setTimeout(() => {
        if (this.lock) {
          this.lock.reset()
          this.lock.enable()
        }
      }, 3000)
      this.lock.disable()
      return this.lock.error()
    }

    this._timer = setTimeout(() => {
      if (this.lock) {
        this.lock.reset()
        this.lock.enable()
      }
    }, 1500)
    this.lock.disable()
    return this.props.patternCallback(pattern)
  }
}

export default PatternLock
