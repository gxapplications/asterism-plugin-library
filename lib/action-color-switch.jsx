'use strict'

/* global $ */
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Row, Tab, Tabs } from 'react-materialize'
import uuid from 'uuid'

import './styles.scss'

/**
* This React component shows a switch to choose one of the theme's buttons colors
* available in the UI default theme.
* The component should be used in a form where a button can accept a color depending
* on the user's choice.
*/
class ActionColorSwitch extends React.Component {
  /**
  * Creates an ActionColorSwitch instance.
  * 
  * @param {object} props - React properties {@link ActionColorSwitch.propTypes}.
  */
  constructor (props) {
    super(props)
    this.state = {
      color: props.defaultColor
    }
    this._id = `actionColorSwitch-${uuid.v4()}`
    this._colors = ['primary', 'secondary', 'inconspicuous', 'edition']
  }

  componentDidMount () {
    $(`#${this._id} ul.tabs`).tabs({ onShow: (p) => {
      $(`#${this._id} ul.tabs > li.tab > a[href^='#']`).each((idx, el) => {
        if ($(el).attr('href') === p.selector) {
          this.setState({ color: this._colors[idx] })
          this.props.onChange(this._colors[idx])
        }
      })
    } })

    const idx = this._colors.indexOf(this.state.color) + 1
    $(`#${this._id} ul.tabs > li:nth-child(${idx}) > a`).click()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.defaultColor !== this.props.defaultColor) {
      return this.setState({ color: this.props.defaultColor })
    }
    if (prevState.color === this.state.color) {
      return
    }

    const idx = this._colors.indexOf(this.state.color) + 1
    $(`#${this._id} ul.tabs > li:nth-child(${idx}) > a`).click()
  }

  render () {
    const { color } = this.state
    const { theme } = this.props

    return (
      <Row id={this._id} className='card actionColorSwitch noPaddedRow'>
        <Tabs className='tabs-fixed-width'>
          <Tab title='Primary' active={color === 'primary'} className={cx(theme.actions.primary, { active: color === 'primary' })} />
          <Tab title='Secondary' active={color === 'secondary'} className={cx(theme.actions.secondary, { active: color === 'secondary' })} />
          <Tab title='Neutral' active={color === 'inconspicuous'} className={cx(theme.actions.inconspicuous, { active: color === 'inconspicuous' })} />
        </Tabs>
      </Row>
    )
  }
}

/**
* React properties to use on this component:
* - thele - the asterism theme object. Often available in the mainState object of a context.
* - animationLevel - the asterism main parameter for visual animatikons. Often available from the parent component, or in the mainState object of a context.
*/
ActionColorSwitch.propTypes = {
  theme: PropTypes.object.isRequired,
  animationLevel: PropTypes.number.isRequired,
  defaultColor: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

ActionColorSwitch.defaultProps = {
  defaultColor: 'secondary'
}

export default ActionColorSwitch