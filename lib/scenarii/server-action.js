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
    // TODO !3: manage a way to abort an action when we dev scenarii... (in another action, because default one does not support abort...). See comment in devtools log action for example
    return Promise.resolve(true)
  }
}
