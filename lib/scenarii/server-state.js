'use strict'

import uuid from 'uuid'

export default class ServerState {
  constructor (data) {
    this.data = data
    this.listeners = []
  }

  get name () {
    return 'ServerState'
  }

  get state () {
    return this.data.state
  }

  set state (state) {
    this.data.state = state
    this.listeners.forEach((listener) => {
      try {
        listener(state, this)
      } catch (error) {
        console.error(error)
      }
    })
  }

  addListener (listener) {
    listener.stateListenerId = uuid.v4()
    this.listeners.push(listener)
    return listener.stateListenerId
  }

  removeListener (listenerId) {
    this.listeners = this.listeners.filter((listener) => listener.stateListenerId !== listenerId)
  }
}
