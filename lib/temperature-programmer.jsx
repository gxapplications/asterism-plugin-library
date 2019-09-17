'use strict'

/* global $, window */
import PropTypes from 'prop-types'
import React from 'react'
import uuid from 'uuid'

import DoubleKnob from './jquery.temperature-programmer'

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
    scaleOffset: PropTypes.number.isRequired,
    scaleAmplitude: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    temperaturesGetter: PropTypes.func.isRequired,
    plannerGetter: PropTypes.func.isRequired,
    onTemperaturesChange: PropTypes.func.isRequired,
    onPlannerChange: PropTypes.func.isRequired,
    onForceModeChange: PropTypes.func.isRequired
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

    DoubleKnob($, window)
  }

  componentWillMount () {
    // TODO !0: fetch state.plannings and state.todayOverridenPlanning from props.plannerGetter
    // TODO !0: fetch state.ecoTemperature and state.comfortTemperature from props.temperaturesGetter
  }

  componentDidMount () {
    this.createDoubleKnob()
    // TODO !0: create a setInterval to update state.currentHourStep and state.today every 0/30 rounded minutes.
  }

  componentDidUpdate (prevProps, prevState) {
    $('div#' + this._id).html('')
    this.doubleKnob.destroy()
    this.doubleKnob = null
    this.createDoubleKnob()
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (
        (nextProps.scaleOffset !== this.props.scaleOffset) ||
        (nextProps.scaleAmplitude !== this.props.scaleAmplitude) ||
        (nextProps.title !== this.props.title) ||
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
    return <div id={this._id} />
  }

  createDoubleKnob () {
    const { scaleOffset, scaleAmplitude, title } = this.props
    const { ecoTemperature, comfortTemperature, plannings, today, currentHourStep, settingDay, forceMode } = this.state

    this.doubleKnob = $('div#' + this._id).temperatureProgrammer({
      ecoTemperature,
      comfortTemperature,
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
        console.log(value) // TODO !0
      },
      onMaxUpdate: (old, value) => {
        this.closePlanningMode()
        if (old === value) {
          return
        }
        value = parseFloat(value) // cast. Can be int or float
        console.log(value) // TODO !0
      },
      onPlanerUpdate: (old, value) => {
        this.maintainPlanningMode()
        if (this.state.settingDay >= 0) {
          // TODO !0: update plannings[settingDay]
        } else {
          // TODO !0: update todayOverridenPlanning
        }
      },
      onDayClick: this.openPlanningMode.bind(this),
      centerTitle: this.centerText[forceMode ? 1 : 0],
      centerState: forceMode,
      onCenterClick: () => {
        this.closePlanningMode()
        this.setState({
          forceMode: !this.state.forceMode
        })
        this.props.onForceModeChange(!this.state.forceMode)
      }
    })
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
