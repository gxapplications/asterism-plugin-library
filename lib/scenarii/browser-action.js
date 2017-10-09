'use strict'

class BrowserAction {
  constructor (data) {
    this.data = data
  }

  get name () {
    return 'BrowserActionInstance'
  }
  get shortLabel () {
    return 'Basic action instance'
  }
  get fullLabel () {
    return 'My basic action instance'
  }

  get EditForm () {
    return null
  }
}

BrowserAction.type = {
  name: 'BrowserAction',
  shortLabel: 'Basic action',
  fullLabel: 'My basic action'
}

export default BrowserAction
