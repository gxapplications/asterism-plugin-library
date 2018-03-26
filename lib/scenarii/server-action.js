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

  abortAll () {
    const ids = Object.entries(this.executionIds).map(([executionId, v]) => executionId)
    return Promise.all(ids.map(executionId => ({ executionId, promise: this.abort(executionId) })))
    .then(results => {
      return { executionIds: results.map(r => r.executionId), result: results.reduce((acc, res) => acc & res, true) }
    }) // at least one false must give false
  }
}
