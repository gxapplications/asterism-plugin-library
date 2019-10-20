'use strict'

/* global $, window */
import PropTypes from 'prop-types'
import React from 'react'
import uuid from 'uuid'
import debounce from 'debounce'
import ResizeObserver from 'resize-observer-polyfill'

import DoubleKnob from './jquery.temperature-programmer'

import './styles.scss'

/**
* This React component shows XXXX
*
* @see XXXX
* @hideconstructor
* @memberof module:Asterism
* @public
*/
class TemperatureProgrammer extends React.Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    animationLevel: PropTypes.number.isRequired,
    scaleOffset: PropTypes.number,
    scaleAmplitude: PropTypes.number,
    title: PropTypes.string.isRequired,
    temperaturesGetter: PropTypes.func,
    plannerGetter: PropTypes.func.isRequired,
    onTemperaturesChange: PropTypes.func,
    onPlannerChange: PropTypes.func.isRequired,
    onForceModeChange: PropTypes.func.isRequired,
    centralColor: PropTypes.string,
    centralText: PropTypes.string
  }

  /**
   * Default properties values.
   *
   * @property {integer} scaleOffset - Lowest temperature value allowed on the knobs track.
   * @property {integer} scaleAmplitude - Highest difference between values. scaleOffset + scaleAmplitude is the higher temperature value allowed on the knobs track.
   * @property {function} temperaturesGetter - Returns a promise resolving { ecoTemperature, comfortTemperature } to init.
   * @property {function} onTemperaturesChange - Handler to receive user changes from knobs.
   * @public
   */
  static defaultProps = {
    scaleOffset: 0,
    scaleAmplitude: 0,
    temperaturesGetter: () => ({ ecoTemperature: 15, comfortTemperature: 19 }),
    onTemperaturesChange: () => {},
    centralColor: null,
    centralText: null
  }

  constructor (props) {
    super(props)

    const now = new Date()
    const currentHourStep = now.getHours() * 2 + (now.getMinutes() > 30 ? 1 : 0)

    this.state = {
      ecoTemperature: 14,
      comfortTemperature: 19,
      plannings: [
        (new Array(48)).fill(1),
        (new Array(48)).fill(1),
        (new Array(48)).fill(1),
        (new Array(48)).fill(1),
        (new Array(48)).fill(1),
        (new Array(48)).fill(1),
        (new Array(48)).fill(1)
      ],
      todayOverridenPlanning: (new Array(48)).fill(1),
      currentHourStep,
      today: now.getDay(),
      settingDay: -1,
      forceMode: false
    }

    this._id = uuid.v4()
    this.centerText = [
      'Force<br/>COMFORT<br/>for 2hrs',
      'Back to<br/>PROG.<br/>mode'
    ]
    this.doubleKnob = null
    this.planningModeTimer = null
    this.resizeDebouncer = null
    this.centerClickTimer = null
    this.centerClickTimeCount = 0

    this._currentHourStepUpdater = null

    DoubleKnob($, window)
  }

  componentWillMount () {
    return Promise.all([this.props.plannerGetter(), this.props.temperaturesGetter()])
    .then(([{ plannings, todayOverridenPlanning }, { ecoTemperature, comfortTemperature }]) => {
      this.setState({
        plannings,
        todayOverridenPlanning,
        ecoTemperature,
        comfortTemperature
      })
    })
  }

  _updateCurrentHourStep () {
    const now = new Date()
    this.setState({
      currentHourStep: (now.getHours() * 2) + (now.getMinutes() > 30 ? 1 : 0)
    })
  }

  componentDidMount () {
    // this.createDoubleKnob()

    // Auto refresh every 30 minutes, rounded
    let oClock = new Date()
    oClock.setMinutes(oClock.getMinutes() < 30 ? 0 : 30, 0, 5)
    oClock = oClock.getTime() + (30 * 60000) // Next round half
    this._currentHourStepUpdater = setTimeout(() => {
      this._updateCurrentHourStep()
      this._currentHourStepUpdater = setInterval(this._updateCurrentHourStep.bind(this), 30 * 60000)
    }, oClock)
  }

  componentWillUnmount () {
    try {
      clearTimeout(this._currentHourStepUpdater)
      clearInterval(this._currentHourStepUpdater)
    } catch (e) {}
  }

  componentDidUpdate (prevProps, prevState) {
    $('div#' + this._id).empty()
    this.doubleKnob = null
    if (this.planningModeTimer) {
      clearTimeout(this.planningModeTimer)
    }
    if (this.centerClickTimer) {
      clearInterval(this.centerClickTimer)
    }
    this.createDoubleKnob()
    console.log('### didUpdate()')
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (
        (nextProps.scaleOffset !== this.props.scaleOffset) ||
        (nextProps.scaleAmplitude !== this.props.scaleAmplitude) ||
        (nextProps.title !== this.props.title) ||
        (nextProps.centralColor !== this.props.centralColor) ||
        (nextProps.centralText !== this.props.centralText) ||
        (nextState.ecoTemperature !== this.state.ecoTemperature) ||
        (nextState.comfortTemperature !== this.state.comfortTemperature) ||
        (nextState.today !== this.state.today) ||
        (nextState.currentHourStep !== this.state.currentHourStep)
    ) {
      return true
    }

    if (nextState.forceMode !== this.state.forceMode) {
      this.doubleKnob.setCenter(this.centerText[nextState.forceMode ? 1 : 0], nextState.forceMode)
    }
    // TODO !0: call other graphical updates here :)

    return false
  }

  render () {
    return <div id={this._id} className='doubleKnob' />
  }

  createDoubleKnob () {
    const { scaleOffset, scaleAmplitude, title, onTemperaturesChange, onPlannerChange, onForceModeChange, centralColor, centralText } = this.props
    const { ecoTemperature, comfortTemperature, plannings, today, currentHourStep, settingDay, forceMode } = this.state

    this.doubleKnob = $('div#' + this._id).temperatureProgrammer({
      minValue: ecoTemperature,
      maxValue: comfortTemperature,
      scaleOffset,
      scaleAmplitude,
      title,
      precision: 1, // 0 for 1° steps, 1 for 0.1° steps
      plannerPrecision: 0.5, // keep it, 48 step by day (every 30 minutes)
      planner: plannings[today],
      currentLed: currentHourStep,
      currentDay: settingDay,
      today,
      onMinUpdate: (old, value) => {
        this.closePlanningMode()
        if (old === value) {
          return
        }
        value = parseFloat(value) // cast. Can be int or float
        onTemperaturesChange(value, this.state.comfortTemperature)
      },
      onMaxUpdate: (old, value) => {
        this.closePlanningMode()
        if (old === value) {
          return
        }
        value = parseFloat(value) // cast. Can be int or float
        onTemperaturesChange(this.state.ecoTemperature, value)
      },
      onPlanerUpdate: (old, value) => {
        this.maintainPlanningMode()
        if (this.state.settingDay >= 0) {
          const newPlannings = [...this.state.plannings]
          newPlannings[settingDay] = value
          onPlannerChange(newPlannings, this.state.todayOverridenPlanning)
          this.setState({ plannings: newPlannings })
          // TODO !0: test if update is not too much
        } else {
          onPlannerChange(this.state.plannings, value)
          this.setState({ todayOverridenPlanning: value })
          // TODO !0: test if update is not too much
        }
      },
      onDayClick: this.openPlanningMode.bind(this),
      centerTitle: centralText || this.centerText[forceMode ? 1 : 0],
      centerState: centralColor || forceMode,
      onCenterClick: (duration) => {
        this.closePlanningMode()
        if (duration) {
          if (this.centerClickTimer) {
            clearInterval(this.centerClickTimer)
          }
          this.doubleKnob.setCenter(centralText || this.centerText[forceMode ? 1 : 0], centralColor || forceMode)
          this.setState({
            forceMode: !this.state.forceMode
          })
          onForceModeChange(!this.state.forceMode, this.centerClickTimeCount)
        } else {
          this.doubleKnob.setCenter(this.state.forceMode ? '' : '120mins<br/>&nbsp;<br/>SET', '#00897b')
          this.centerClickTimeCount = 0
          this.centerClickTimer = setInterval(() => {
            if (this.centerClickTimeCount < 2) {
              this.centerClickTimeCount += 0.5
              this.doubleKnob.setCenter(`${this.centerClickTimeCount * 60}mins<br/>&nbsp;<br/>SET`, '#64ffda')
            } else {
              this.centerClickTimeCount++
              this.doubleKnob.setCenter(`${this.centerClickTimeCount}hrs<br/>&nbsp;<br/>SET`, '#64ffda')
            }
          }, 1200)
        }
      }
    })

    $('div#' + this._id).parent().addClass('no-card')
    this.resizeDebouncer = debounce(() => {
      this.doubleKnob.resizer()
      $('div#' + this._id).parent().addClass('no-card')
    }, 500, false)
    new ResizeObserver(this.resizeDebouncer.bind(this)).observe(window.document.getElementById(this._id))
  }

  closePlanningMode () {
    clearTimeout(this.planningModeTimer)
    this.setState({
      settingDay: -1
    })
    this.doubleKnob.setPlanner(this.state.plannings[this.state.today], -1, this.state.today)
  }

  openPlanningMode (day) {
    this.setState({
      settingDay: day
    })
    this.doubleKnob.setPlanner(this.state.plannings[day], day, this.state.today)
    this.maintainPlanningMode()
  }

  maintainPlanningMode () {
    if (this.planningModeTimer) {
      clearTimeout(this.planningModeTimer)
    }
    this.planningModeTimer = setTimeout(this.closePlanningMode.bind(this), 5000)
  }
}

export default TemperatureProgrammer
