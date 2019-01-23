'use strict'

/**
 * The BrowserTrigger is the class you need to override to describe the behavior of you scenarii element (type trigger)
 * on the browser side. A scenarii trigger element will be instantiated through this extending class on the browser side.
 *
 * In your extending class, you MUST override these attributes:
 * - <YourClass>.type = { name: 'MyOwnTriggerType', shortLabel: 'My trigger', fullLabel: 'My trigger that does something' }
 * - <YourClass>.get name()
 * - <YourClass>.get shortLabel()
 * - <YourClass>.get fullLabel()
 *
 * You can also override these attributes (optional):
 * - <YourClass>.constructor()
 * - <YourClass>.get EditForm()
 *
 * You need also to override ServerTrigger in another class to describe the server side behavior of your trigger.
 *
 * Implementation example: see below.
 * @see https://github.com/gxapplications/asterism/blob/master/lib/plugins/scenarii/base-elements/time-based-trigger/browser.js
 * @memberof module:asterism-plugin-library/scenarii
 * @public
 * @abstract
 */
class BrowserTrigger {
  /**
   * Properties to override in each extending class.
   * Type properties are supposed to describe the trigger type itself (not the instances of that trigger type).
   *
   * @property {string} name - A unique identifier for your class. Often the class name. Used in logs and for technical reasons.
   * @property {string} shortLabel - A SHORT description of your trigger type. Try to limit to ~25 chars approximately.
   * @property {string} fullLabel - A full description of your trigger type. Will complete the short label, so don't need to repeat the shortLabel inside the fullLabel, just complete. Limit to 2 lines of description.
   * @public
   */
  static type = {
    name: 'BrowserTrigger',
    shortLabel: 'Basic trigger',
    fullLabel: 'My basic trigger'
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
   * Returns the name of the trigger instance (not the trigger type).
   * The name must be very short (limit to ~25 chars approximately).
   * It is often the name of the element that is listened by the trigger.
   *
   * eg.: "Room door sensor"
   *
   * @returns {string}
   * @public
   */
  get name () {
    return 'BrowserTriggerInstance'
  }

  /**
   * Returns the short label of the trigger instance (not the trigger type).
   * The short label must be quite short (limit to ~40 chars approximately).
   * It is often the short summary of the trigger.
   *
   * eg.: "'Room door sensor' opens"
   *
   * @returns {string}
   * @public
   */
  get shortLabel () {
    return 'Basic trigger instance'
  }

  /**
   * Returns the long label of the trigger instance (not the trigger type).
   * The full label must be concise but fully qualified (limit to a line of description).
   *
   * eg.: "'Room door sensor' just opened"
   *
   * @returns {string}
   * @public
   */
  get fullLabel () {
    return 'My basic trigger instance'
  }

  /**
   * Must return the component to use as Setting paneml to set/update the trigger instance.
   * If null, there is no setting panel, the trigger instance is created directly.
   *
   * @returns {React.Component}
   * @public
   */
  get EditForm () {
    return null
  }
}

export default BrowserTrigger
