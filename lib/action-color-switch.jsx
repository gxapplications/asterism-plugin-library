'use strict'

import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Row } from 'react-materialize'

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
* @memberof module:asterism-plugin-library
* @public
*/
class ActionColorSwitch extends React.Component {
  /**
   * React properties to use on this component.
   *
   * @property {object} theme - The asterism theme object. Often available from the parent component, or in the mainState object of a context.
   * @property {number} animationLevel - The asterism main parameter for visual animations. Often available from the parent component, or in the mainState object of a context.
   * @property {string} defaultColor - The default color to set to the component when mounted. By default, will be "secondary".
   * @property {func} onChange - A function called as a callback when the user changes the color. Take color as argument.
   * @public
   */
  static propTypes = {
    theme: PropTypes.object.isRequired,
    animationLevel: PropTypes.number.isRequired,
    defaultColor: PropTypes.string,
    onChange: PropTypes.func.isRequired
  }

  /**
   * Default properties values.
   * @property {string} defaultColor - "secondary"
   * @public
   */
  static defaultProps = {
    defaultColor: 'secondary'
  }

  constructor (props) {
    super(props)
    this.state = {
      color: props.defaultColor
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.defaultColor !== this.props.defaultColor) {
      return this.setState({ color: this.props.defaultColor })
    }
  }

  render () {
    const { color } = this.state
    const { theme } = this.props

    return (
      <Row className='actionColorSwitch'>
        <button className={cx('col s4 fluid', (color === 'primary') ? 'btn-flat' : 'btn', theme.actions.primary)}
          onClick={this.selectColor.bind(this, 'primary')}>
          <i className='material-icons left'>{color === 'primary' ? 'radio_button_checked' : 'radio_button_unchecked'}</i>
          Primary
        </button>
        <button className={cx('col s4 fluid', (color === 'secondary') ? 'btn-flat' : 'btn', theme.actions.secondary)}
          onClick={this.selectColor.bind(this, 'secondary')}>
          <i className='material-icons left'>{color === 'secondary' ? 'radio_button_checked' : 'radio_button_unchecked'}</i>
          Secondary
        </button>
        <button className={cx('col s4 fluid', (color === 'inconspicuous') ? 'btn-flat' : 'btn', theme.actions.inconspicuous)}
          onClick={this.selectColor.bind(this, 'inconspicuous')}>
          <i className='material-icons left'>{color === 'inconspicuous' ? 'radio_button_checked' : 'radio_button_unchecked'}</i>
          Neutral
        </button>
      </Row>
    )
  }

  selectColor (color) {
    this.setState({
      color
    })
    this.props.onChange(color)
  }
}

export default ActionColorSwitch
