'use strict'

import uuid from 'uuid'

export default class ServerTrigger {
  constructor (data) {
    this.data = data
    this.listeners = []
  }

  get name () {
    return 'ServerTrigger'
  }

  reschedule () {
    // See examples in asterism/plugins/scenarii/base-elements/*trigger
    return Promise.resolve(true)
  }

  addListener (listener) {
    listener.triggerListenerId = uuid.v4()
    this.listeners.push(listener)
    return listener.triggerListenerId
  }

  removeListener (listenerId) {
    this.listeners = this.listeners.filter((listener) => listener.triggerListenerId !== listenerId)
  }
}
