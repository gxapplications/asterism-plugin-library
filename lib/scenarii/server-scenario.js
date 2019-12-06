'use strict'

import uuid from 'uuid'

/**
 * The ServerScenario is the class you need to override to describe the behavior of you scenarii element (type scenario)
 * on the server side. A scenarii scenario element will be instantiated through this extending class on the server side.
 *
 * In your extending class, you MUST override these attributes:
 * - <YourClass>.get name()
 *
 * You can also override these attributes (optional):
 * - <YourClass>.constructor()
 * - <YourClass>.get activated()
 * - <YourClass>.set activated()
 * - <YourClass>.trigger()
 * - <YourClass>.abort()
 * - <YourClass>.afterUpdate()
 *
 * You need also to override BrowserScenario in another class to describe the browser side behavior of your scenario.
 *
 * Implementation example: see below.
 * @see https://github.com/gxapplications/asterism/blob/master/lib/plugins/scenarii/base-elements/actionable-scenario/server.js
 * @memberof module:Scenarii
 * @public
 * @abstract
 */
class ServerScenario {
  /**
   * You can override the constructor.
   * Don't forget to pass data parameter to the super() constructor.
   *
   * @public
   */
  constructor (data) {
    this.data = data
    this.listeners = []
  }

  /**
   * Returns the name of the scenario instance (not the scenario type).
   * The name must be very short (limit to ~25 chars approximately).
   * It is often the name of the element that is manipulated through the scenario.
   *
   * eg.: "Room light #2"
   *
   * @returns {string}
   * @public
   */
  get name () {
    return 'ServerScenario'
  }

  /**
   * Is this scenario instance activated?
   * If not, then the .trigger() method should do nothing...
   *
   * @returns {boolean}
   * @public
   */
  get activated () {
    return this.data.activated
  }

  /**
   * Changes activation state for this scenario instance.
   *
   * @param {boolean} value - To activate the scenario, should be true.
   * @public
   */
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

  /**
   * This method can activate / deactivate, with some soft logic (delay, checks, else...)
   * By default, change activation state immediately, and resolve.
   * This method is not mandatory, if you set activated directly, soft logic won't be triggered.
   *
   * @param value
   * @returns {Promise}
   * @public
   */
  requestSoftActivation (value) {
    this.activated = !!value
    return Promise.resolve(true)
  }

  /**
   * This method is used to force a scenario instance to run now.
   * In most of the cases, this method should be kept as is.
   *
   * @returns {Promise} - A promise resolving when the whole process behind the scenario has finished. This can resolve before that, in an asynchronous situation.
   * @public
   */
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

  /**
   * This method is used to force a scenario instance to stop now, if possible.
   * In most of the cases, this method should be kept as is.
   *
   * @returns {Promise} - A promise resolving when abort has finished.
   * @public
   */
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

  /**
   * Called when scenario instance has been updated: parameters has changed, so process should be updated server side.
   *
   * @returns {Promise} - A promise resolving when update has finished.
   * @public
   */
  afterUpdate () {
    // See example of asterism/plugins/scenarii/base-elements/actionable-scenario
    return Promise.resolve(true)
  }
}

export default ServerScenario
