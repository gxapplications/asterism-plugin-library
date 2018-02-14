'use strict'

class BrowserState {
  constructor (data) {
    this.data = data
  }

  get name () {
    return 'BrowserStateInstance'
  }
  get shortLabel () {
    return 'Basic state instance'
  }
  get fullLabel () {
    return 'My basic state instance'
  }

  get EditForm () {
    return null
  }

  get state () {
    return this.data.state
  }
}

BrowserState.type = {
  name: 'BrowserState',
  shortLabel: 'Basic state',
  fullLabel: 'My basic state'
}

export default BrowserState
