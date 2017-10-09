'use strict'

export default class ServerAction {
  constructor (data) {
    this.data = data
  }

  get name () {
    return 'ServerAction'
  }

  execute () {
    return Promise.resolve(true)
  }

  abort () {
    // TODO !3: manage a way to abort an action when we dev scenarii...
    return Promise.resolve(true)
  }
}
