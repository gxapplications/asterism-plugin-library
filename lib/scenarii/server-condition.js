'use strict'

export default class ServerCondition {
  constructor (data) {
    this.data = data
  }

  get name () {
    return 'ServerCondition'
  }

  test () {
    return Promise.resolve(true)
  }
}
