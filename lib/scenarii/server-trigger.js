'use strict'

import uuid from 'uuid'

/**
 * The ServerTrigger is the class you need to override to describe the behavior of you scenarii element (type trigger)
 * on the server side. A scenarii trigger element will be instantiated through this extending class on the server side.
 *
 * In your extending class, you MUST override these attributes:
 * - <YourClass>.get name()
 * - <YourClass>.reschedule()
 *
 * You can also override these attributes (optional):
 * - <YourClass>.constructor()
 *
 * You need also to override BrowserTrigger in another class to describe the browser side behavior of your trigger.
 *
 * Implementation example: see below.
 * @see https://github.com/gxapplications/asterism/blob/master/lib/plugins/scenarii/base-elements/level-state-trigger/server.js
 * @memberof module:Scenarii
 * @public
 * @abstract
 */
class ServerTrigger {
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
   * Returns the name of the trigger instance (not the trigger type).
   * The name must be very short (limit to ~25 chars approximately).
   * It is often the name of the element that is looked through the trigger.
   *
   * eg.: "Room light sensor"
   *
   * @returns {string}
   * @public
   */
  get name () {
    return 'ServerTrigger'
  }

  /**
   *
   *
   * @returns {Promise}
   * @public
   */
  reschedule () {
    // See examples in asterism/plugins/scenarii/base-elements/*trigger
    return Promise.resolve(true)
  }

  /** @private */
  addListener (listener) {
    listener.triggerListenerId = uuid.v4()
    this.listeners.push(listener)
    return listener.triggerListenerId
  }

  /** @private */
  removeListener (listenerId) {
    this.listeners = this.listeners.filter((listener) => listener.triggerListenerId !== listenerId)
  }
}

export default ServerTrigger
