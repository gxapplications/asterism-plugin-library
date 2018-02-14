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
* The component should be used in a form to configure a button that can accept a color depending
* on the user's choice.
*
* Default color is 'secondary'.
* Available colors are: 'primary', 'secondary', 'inconspicuous'.
*
* @example <caption>Can use it in React JSX syntax</caption>
* <ActionColorSwitch
*     theme={this.props.theme}
*     animationLevel={this.props.animationLevel}
*     defaultColor="primary"
*     onChange={(color) => { this.currentColor = color; }}
* />
*
* @see https://github.com/gxapplications/asterism/blob/master/lib/plugins/navigation-tools/go-to-path-button/setting-panel.jsx
* @hideconstructor
* @public
*/
class ActionColorSwitch extends React.Component {
  /**
   * React properties to use on this component.
   *
   * @property {object} theme - The asterism theme object. Often available from the parent component, or in the mainState object of a context.
   * @property {number} animationLevel - The asterism main parameter for visual animations. Often available from the parent component, or in the mainState object of a context.
   * @property {string} defaultColor - The default color to set to the component when mounted. By default, will be 'secondary'.
   * @property {func} onChange - A function called as a callback when the user changes the color. Take color as argument.
   * @public
   */
  static propTypes = {
    theme: PropTypes.object.isRequired,
    animationLevel: PropTypes.number.isRequired,
    defaultColor: PropTypes.string,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    /** @default {ActionColorSwitch.propTypes.defaultColor} */
    defaultColor: 'secondary'
  }

  constructor (props) {
    super(props)
    this.state = {
      color: props.defaultColor
    }
    this._id = `actionColorSwitch-${uuid.v4()}`
    this._colors = ['primary', 'secondary', 'inconspicuous']
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

export default ActionColorSwitch
