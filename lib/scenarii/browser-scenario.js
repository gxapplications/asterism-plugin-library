'use strict'

/**
 * The BrowserScenario is the class you need to override to describe the behavior of you scenarii element (type scenario)
 * on the browser side. A scenarii scenario element will be instantiated through this extending class on the browser side.
 *
 * In your extending class, you MUST override these attributes:
 * - <YourClass>.type = { name: 'MyOwnScenarioType', shortLabel: 'My scenario', fullLabel: 'My scenario that does something' }
 * - <YourClass>.get name()
 * - <YourClass>.get shortLabel()
 * - <YourClass>.get fullLabel()
 *
 * You can also override these attributes (optional):
 * - <YourClass>.constructor()
 * - <YourClass>.get EditForm()
 *
 * You need also to override ServerScenario in another class to describe the server side behavior of your scenario.
 *
 * There is few scenario types:
 * - the native scenario type in asterism is the 'actionable-scenario': a trigger and a condition can launch an action,
 * - another type of scenario will be available on asterism-plugin-zwave plugin, for specific zwave scenarii (will be released ~2020...).
 *
 * Implementation example: see below.
 * @see https://github.com/gxapplications/asterism/blob/master/lib/plugins/scenarii/base-elements/actionable-scenario/browser.js
 * @memberof module:Scenarii
 * @public
 * @abstract
 */
class BrowserScenario {
  /**
   * Properties to override in each extending class.
   * Type properties are supposed to describe the scenario type itself (not the instances of that scenario type).
   *
   * @property {string} name - A unique identifier for your class. Often the class name. Used in logs and for technical reasons.
   * @property {string} shortLabel - A SHORT description of your scenario type. Try to limit to ~25 chars approximately.
   * @property {string} fullLabel - A full description of your scenario type. Will complete the short label, so don't need to repeat the shortLabel inside the fullLabel, just complete. Limit to 2 lines of description.
   * @public
   */
  static type = {
    name: 'BrowserScenario',
    shortLabel: 'Basic scenario',
    fullLabel: 'My basic scenario'
  }

  /**
   * You can override the constructor.
   * Don't forget to pass data parameter to the super() constructor.
   *
   * @public
   */
  constructor (data) {
    this.data = data
  }

  /**
   * Returns the name of the scenario instance (not the scenario type).
   * The name must be very short (limit to ~25 chars approximately).
   * It is often the name of the elements that are manipulated through the scenario (triggers, actions, etc...).
   *
   * eg.: "'Room door #2' opened => 'Room light #2' > ON"
   *
   * @returns {string}
   * @public
   */
  get name () {
    return 'BrowserScenarioInstance'
  }

  /**
   * Returns the short label of the scenario instance (not the scenario type).
   * The short label must be quite short (limit to ~40 chars approximately).
   * It is often the short summary of the scenario.
   *
   * eg.: "When 'Room door #2' opened & between 11:30AM-3:45PM, 'Room light #2' > ON"
   *
   * @returns {string}
   * @public
   */
  get shortLabel () {
    return 'Basic scenario instance'
  }

  /**
   * Returns the long label of the scenario instance (not the scenario type).
   * The full label must be concise but fully qualified (limit to a line of description).
   *
   * eg.: "When 'Room door #2' is opened, and current time is between 11:30AM and 3:45PM, then turns ON 'Room light #2'"
   *
   * @returns {string}
   * @public
   */
  get fullLabel () {
    return 'My basic scenario instance'
  }

  /**
   * Must return the component to use as Setting paneml to set/update the scenario instance.
   * If null, there is no setting panel, the scenario instance is created directly.
   *
   * @returns {React.Component}
   * @public
   */
  get EditForm () {
    return null
  }
}

export default BrowserScenario
