'use strict'

export default class ServerAction {
  constructor (data) {
    this.data = data

    this.executionIds = {}
  }

  get name () {
    return 'ServerAction'
  }

  execute (executionId) {
    const action = Promise.resolve(true)
    this.executionIds[executionId] = action
    return action.then(() => { delete this.executionIds[executionId] }).catch(() => { delete this.executionIds[executionId] })
  }

  abort (executionId) {
    // See comments in devtools log action for example of an abortable action
    return Promise.resolve(true)
  }
}
