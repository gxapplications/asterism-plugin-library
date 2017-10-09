'use strict'

class BrowserCondition {
  constructor (data) {
    this.data = data
  }

  get name () {
    return 'BrowserConditionInstance'
  }
  get shortLabel () {
    return 'Basic condition instance'
  }
  get fullLabel () {
    return 'My basic condition instance'
  }

  get EditForm () {
    return null
  }
}

BrowserCondition.type = {
  name: 'BrowserCondition',
  shortLabel: 'Basic condition',
  fullLabel: 'My basic condition'
}

export default BrowserCondition
