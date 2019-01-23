'use strict'

import uuid from 'uuid'

/**
 * The ServerState is the class you need to override to describe the behavior of you scenarii element (type state)
 * on the server side. A scenarii state element will be instantiated through this extending class on the server side.
 *
 * In your extending class, you MUST override these attributes:
 * - <YourClass>.get name()
 *
 * You can also override these attributes (optional):
 * - <YourClass>.constructor()
 * - <YourClass>.get state()
 * - <YourClass>.set state()
 * - <YourClass>.preValidate()
 *
 * You need also to override BrowserAction in another class to describe the browser side behavior of your action.
 *
 * Implementation example: see below.
 * @see https://github.com/gxapplications/asterism/blob/master/lib/plugins/scenarii/base-elements/level-state/server.js
 * @memberof module:asterism-plugin-library/scenarii
 * @public
 * @abstract
 */
class ServerState {
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
   * Returns the name of the state instance (not the state type).
   * The name must be very short (limit to ~25 chars approximately).
   * It is often the name of the concept that is manipulated through the state.
   *
   * eg.: "Alarm level"
   *
   * @returns {string}
   * @public
   */
  get name () {
    return 'ServerState'
  }

  /**
   * Gets actual state value.
   *
   * @returns {*} - The state value (type will vary depending on your implementation)
   * @public
   */
  get state () {
    return this.data.state
  }

  /**
   * Sets state value.
   * This call will trigger state listeners with the new value.
   *
   * @param {*} state - The value to set on the state.
   * @public
   */
  set state (state) {
    // if listeners have preValidate and one of these returns false, then do not update state
    if (!this.preValidate(state)) {
      return
    }

    this.data.state = state
    this.listeners.forEach((listener) => {
      try {
        listener(state, this)
      } catch (error) {
        console.error(error)
      }
    })
  }

  /**
   * Prevalidate the new state value.
   * This call will ask state listeners with the new value, to know if one of the listeners accepts the new value.
   * If one reject the new value, then the state is not updated.
   *
   * @param {*} state - The new value proposed for the state.
   * @param {*} oldState - The value before update, to let listener compare and decide.
   * @returns {boolean} - If true, listeners accept the new value. Update can be done.
   * @public
   */
  preValidate (state, oldState) {
    let validate = true
    this.listeners.forEach((listener) => {
      try {
        if (listener.preValidate) {
          validate = validate && listener.preValidate(state, this, oldState)
        }
      } catch (error) {
        console.error(error)
      }
    })
    return validate
  }

  /** @private */
  addListener (listener) {
    listener.stateListenerId = uuid.v4()
    this.listeners.push(listener)
    return listener.stateListenerId
  }

  /** @private */
  removeListener (listenerId) {
    this.listeners = this.listeners.filter((listener) => listener.stateListenerId !== listenerId)
  }
}

export default ServerState
