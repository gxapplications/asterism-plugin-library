'use strict'

/**
 * The BrowserCondition is the class you need to override to describe the behavior of you scenarii element (type condition)
 * on the browser side. A scenarii condition element will be instantiated through this extending class on the browser side.
 *
 * In your extending class, you MUST override these attributes:
 * - <YourClass>.type = { name: 'MyOwnConditionType', shortLabel: 'My condition', fullLabel: 'My condition that checks something' }
 * - <YourClass>.get name()
 * - <YourClass>.get shortLabel()
 * - <YourClass>.get fullLabel()
 *
 * You can also override these attributes (optional):
 * - <YourClass>.constructor()
 * - <YourClass>.get EditForm()
 *
 * You need also to override ServerCondition in another class to describe the server side behavior of your condition.
 *
 * Implementation example: see below.
 * @see https://github.com/gxapplications/asterism/blob/master/lib/plugins/scenarii/base-elements/time-based-condition/browser.js
 * @memberof module:Scenarii
 * @public
 * @abstract
 */
class BrowserCondition {
  /**
   * Properties to override in each extending class.
   * Type properties are supposed to describe the condition type itself (not the instances of that condition type).
   *
   * @property {string} name - A unique identifier for your class. Often the class name. Used in logs and for technical reasons.
   * @property {string} shortLabel - A SHORT description of your condition type. Try to limit to ~25 chars approximately.
   * @property {string} fullLabel - A full description of your condition type. Will complete the short label, so don't need to repeat the shortLabel inside the fullLabel, just complete. Limit to 2 lines of description.
   * @public
   */
  static type = {
    name: 'BrowserCondition',
    shortLabel: 'Basic condition',
    fullLabel: 'My basic condition'
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
   * Returns the name of the condition instance (not the condition type).
   * The name must be very short (limit to ~25 chars approximately).
   * It is often the name of the element that is manipulated through the condition.
   *
   * eg.: "Room sensor #2", "11:30AM-3:45PM", ...
   *
   * @returns {string}
   * @public
   */
  get name () {
    return 'BrowserConditionInstance'
  }

  /**
   * Returns the short label of the condition instance (not the condition type).
   * The short label must be quite short (limit to ~40 chars approximately).
   * It is often the short summary of the condition.
   *
   * eg.: "'Room sensor #2' opened", "between 11:30AM and 3:45PM everyday"
   *
   * @returns {string}
   * @public
   */
  get shortLabel () {
    return 'Basic condition instance'
  }

  /**
   * Returns the long label of the condition instance (not the condition type).
   * The full label must be concise but fully qualified (limit to a line of description).
   *
   * eg.: "the 'Room sensor #2' is in opened state", "the current time is between 11:30AM and 3:45PM, everyday"
   *
   * @returns {string}
   * @public
   */
  get fullLabel () {
    return 'My basic condition instance'
  }

  /**
   * Must return the component to use as Setting paneml to set/update the condition instance.
   * If null, there is no setting panel, the condition instance is created directly.
   *
   * @returns {React.Component}
   * @public
   */
  get EditForm () {
    return null
  }
}

export default BrowserCondition
