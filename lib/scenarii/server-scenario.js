'use strict'

import uuid from 'uuid'

export default class ServerScenario {
  constructor (data) {
    this.data = data
    this.listeners = []
  }

  get name () {
    return 'ServerScenario'
  }

  get activated () {
    return this.data.activated
  }

  set activated (value) {
    this.data.activated = !!value
    this.listeners.forEach((listener) => {
      try {
        listener('activationChanged', value, this)
      } catch (error) {
        console.error(error)
      }
    })
  }

  trigger (executionId, nextStep = (result) => result) {
    const triggerChain = Promise.resolve(true).then(nextStep)
    triggerChain.executionId = executionId
    this.listeners.forEach((listener) => {
      try {
        listener('triggered', triggerChain, this)
      } catch (error) {
        console.error(error)
      }
    })
    return triggerChain
  }

  abort (executionId, nextStep = (result) => result) {
    // See comments in actionable scenario for example of an abortable scenario
    const triggerChain = Promise.resolve(true).then(nextStep)
    triggerChain.executionId = executionId
    this.listeners.forEach((listener) => {
      try {
        listener('aborted', triggerChain, this)
      } catch (error) {
        console.error(error)
      }
    })
    return triggerChain
  }

  addListener (listener) {
    listener.scenarioListenerId = uuid.v4()
    this.listeners.push(listener)
    return listener.scenarioListenerId
  }

  removeListener (listenerId) {
    this.listeners = this.listeners.filter((listener) => listener.scenarioListenerId !== listenerId)
  }

  afterUpdate () {
    // See example of asterism/plugins/scenarii/base-elements/actionable-scenario
    return Promise.resolve(true)
  }
}
