'use strict'

class BrowserTrigger {
  constructor (data) {
    this.data = data
  }

  get name () {
    return 'BrowserTriggerInstance'
  }
  get shortLabel () {
    return 'Basic trigger instance'
  }
  get fullLabel () {
    return 'My basic trigger instance'
  }

  get EditForm () {
    return null
  }
}

BrowserTrigger.type = {
  name: 'BrowserTrigger',
  shortLabel: 'Basic trigger',
  fullLabel: 'My basic trigger'
}

export default BrowserTrigger
