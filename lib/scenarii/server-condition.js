'use strict'

/**
 * The ServerCondition is the class you need to override to describe the behavior of you scenarii element (type condition)
 * on the server side. A scenarii condition element will be instantiated through this extending class on the server side.
 *
 * In your extending class, you MUST override these attributes:
 * - <YourClass>.get name()
 * - <YourClass>.test()
 *
 * You can also override these attributes (optional):
 * - <YourClass>.constructor()
 *
 * You need also to override BrowserCondition in another class to describe the browser side behavior of your condition.
 *
 * Implementation example: see below.
 * @see https://github.com/gxapplications/asterism/blob/master/lib/plugins/scenarii/base-elements/astral-time-condition/server.js
 * @memberof module:Scenarii
 * @public
 * @abstract
 */
class ServerCondition {
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
   * eg.: "Room light #2"
   *
   * @public
   */
  get name () {
    return 'ServerCondition'
  }

  /**
   * This method is overriden to make the conditional test.
   *
   * For example, a condition that test if current time is AM and not PM, it should return true if test() is called at AM time.
   * The method always returns a promise: some test could take time (but not too much: there is a short timeout of 9 seconds.
   * If the condition takes more thant 9 seconds to execute, then the behavior depends on the process that uses the condition,
   * BUT the interface will consider test as failed.
   *
   * @returns {Promise} - Resolves with true if the condition passes, with false if the condition blocks. Reject if an error occurred.
   */
  test () {
    return Promise.resolve(true)
  }
}

export default ServerCondition
