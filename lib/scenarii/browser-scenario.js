'use strict'

class BrowserScenario {
  constructor (data) {
    this.data = data
  }

  get name () {
    return 'BrowserScenarioInstance'
  }
  get shortLabel () {
    return 'Basic scenario instance'
  }
  get fullLabel () {
    return 'My basic scenario instance'
  }

  get EditForm () {
    return null
  }
}

BrowserScenario.type = {
  name: 'BrowserScenario',
  shortLabel: 'Basic scenario',
  fullLabel: 'My basic scenario'
}

export default BrowserScenario
