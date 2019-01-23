'use strict'

/**
 * The BrowserState is the class you need to override to describe the behavior of you state element (type state)
 * on the browser side. A scenarii state element will be instantiated through this extending class on the browser side.
 *
 * In your extending class, you MUST override these attributes:
 * - <YourClass>.type = { name: 'MyOwnStateType', shortLabel: 'My state', fullLabel: 'My state that represents something' }
 * - <YourClass>.get name()
 * - <YourClass>.get shortLabel()
 * - <YourClass>.get fullLabel()
 *
 * You can also override these attributes (optional):
 * - <YourClass>.constructor()
 * - <YourClass>.get EditForm()
 *
 * You need also to override ServerState in another class to describe the server side behavior of your state.
 *
 * Implementation example: see below.
 * @see https://github.com/gxapplications/asterism/blob/master/lib/plugins/scenarii/base-elements/level-state/browser.js
 * @memberof module:asterism-plugin-library/scenarii
 * @public
 * @abstract
 */
class BrowserState {
  /**
   * Properties to override in each extending class.
   * Type properties are supposed to describe the state type itself (not the instances of that state type).
   *
   * @property {string} name - A unique identifier for your class. Often the class name. Used in logs and for technical reasons.
   * @property {string} shortLabel - A SHORT description of your state type. Try to limit to ~25 chars approximately.
   * @property {string} fullLabel - A full description of your state type. Will complete the short label, so don't need to repeat the shortLabel inside the fullLabel, just complete. Limit to 2 lines of description.
   * @public
   */
  static type = {
    name: 'BrowserState',
    shortLabel: 'Basic state',
    fullLabel: 'My basic state'
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
   * Returns the name of the state instance (not the state type).
   * The name must be very short (limit to ~25 chars approximately).
   * It is often the name of the element that is represented through the state.
   *
   * eg.: "Home alarm"
   *
   * @returns {string}
   * @public
   */
  get name () {
    return 'BrowserStateInstance'
  }

  /**
   * Returns the short label of the state instance (not the state type).
   * The short label must be quite short (limit to ~40 chars approximately).
   * It is often the short summary of the state.
   *
   * eg.: "Home alarm level"
   *
   * @returns {string}
   * @public
   */
  get shortLabel () {
    return 'Basic state instance'
  }

  /**
   * Returns the long label of the state instance (not the state type).
   * The full label must be concise but fully qualified (limit to a line of description).
   *
   * eg.: "Home alarm activation level (from 1 to 5)"
   *
   * @returns {string}
   * @public
   */
  get fullLabel () {
    return 'My basic state instance'
  }

  /**
   * Must return the component to use as Setting paneml to set/update the state instance.
   * If null, there is no setting panel, the state instance is created directly.
   *
   * @returns {React.Component}
   * @public
   */
  get EditForm () {
    return null
  }

  /**
   * Must return the current value of the state instance.
   * If you need to override this, use this.data.state as basement, add your business value, and return it.
   *
   * @returns {*}
   * @public
   */
  get state () {
    return this.data.state
  }
}

export default BrowserState
