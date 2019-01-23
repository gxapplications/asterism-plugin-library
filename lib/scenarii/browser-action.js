'use strict'

/**
 * The BrowserAction is the class you need to override to describe the behavior of you scenarii element (type action)
 * on the browser side. A scenarii action element will be instantiated through this extending class on the browser side.
 *
 * In your extending class, you MUST override these attributes:
 * - <YourClass>.type = { name: 'MyOwnActionType', shortLabel: 'My action', fullLabel: 'My action that does something' }
 * - <YourClass>.get name()
 * - <YourClass>.get shortLabel()
 * - <YourClass>.get fullLabel()
 *
 * You can also override these attributes (optional):
 * - <YourClass>.constructor()
 * - <YourClass>.get EditForm()
 *
 * You need also to override ServerAction in another class to describe the server side behavior of your action.
 *
 * Implementation example: see below.
 * @see https://github.com/gxapplications/asterism/blob/master/lib/plugins/scenarii/base-elements/wait/browser.js
 * @memberof module:asterism-plugin-library/scenarii
 * @public
 * @abstract
 */
class BrowserAction {
  /**
   * Properties to override in each extending class.
   * Type properties are supposed to describe the action type itself (not the instances of that action type).
   *
   * @property {string} name - A unique identifier for your class. Often the class name. Used in logs and for technical reasons.
   * @property {string} shortLabel - A SHORT description of your action type. Try to limit to ~25 chars approximately.
   * @property {string} fullLabel - A full description of your action type. Will complete the short label, so don't need to repeat the shortLabel inside the fullLabel, just complete. Limit to 2 lines of description.
   * @public
   */
  static type = {
    name: 'BrowserAction',
    shortLabel: 'Basic action',
    fullLabel: 'My basic action'
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
   * Returns the name of the action instance (not the action type).
   * The name must be very short (limit to ~25 chars approximately).
   * It is often the name of the element that is manipulated through the action.
   *
   * eg.: "Room light #2"
   *
   * @returns {string}
   * @public
   */
  get name () {
    return 'BrowserActionInstance'
  }

  /**
   * Returns the short label of the action instance (not the action type).
   * The short label must be quite short (limit to ~40 chars approximately).
   * It is often the short summary of the action.
   *
   * eg.: "'Room light #2' > ON"
   *
   * @returns {string}
   * @public
   */
  get shortLabel () {
    return 'Basic action instance'
  }

  /**
   * Returns the long label of the action instance (not the action type).
   * The full label must be concise but fully qualified (limit to a line of description).
   *
   * eg.: "Will turn ON the switch 'Room light #2'"
   *
   * @returns {string}
   * @public
   */
  get fullLabel () {
    return 'My basic action instance'
  }

  /**
   * Must return the component to use as Setting paneml to set/update the action instance.
   * If null, there is no setting panel, the action instance is created directly.
   *
   * @returns {React.Component}
   * @public
   */
  get EditForm () {
    return null
  }
}

export default BrowserAction
