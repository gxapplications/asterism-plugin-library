'use strict'

/**
 * The ServerAction is the class you need to override to describe the behavior of you scenarii element (type action)
 * on the server side. A scenarii action element will be instantiated through this extending class on the server side.
 *
 * In your extending class, you MUST override these attributes:
 * - <YourClass>.get name()
 * - <YourClass>.execute()
 *
 * You can also override these attributes (optional):
 * - <YourClass>.constructor()
 * - <YourClass>.abort()
 *
 * You need also to override BrowserAction in another class to describe the browser side behavior of your action.
 *
 * Implementation example: see below.
 * @see https://github.com/gxapplications/asterism/blob/master/lib/plugins/scenarii/base-elements/wait/server.js
 * @memberof module:Scenarii
 * @public
 * @abstract
 */
class ServerAction {
  /**
   * You can override the constructor.
   * Don't forget to pass data parameter to the super() constructor.
   *
   * @public
   */
  constructor (data) {
    this.data = data

    this.executionIds = {}
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
    return 'ServerAction'
  }

  /**
   * This method will execute the current action instance process. It returns a Promise that will resolve after the execution.
   * This could take a while.
   *
   * @param {string} executionId - A unique execution ID, to keep on your side (to track its execution or to abort it if needed).
   * @returns {Promise} - A promise, resolving when action finished (successfully: resolve, faulty: reject).
   * @public
   */
  execute (executionId) {
    const action = Promise.resolve(true)
    this.executionIds[executionId] = action
    return action.then(() => { delete this.executionIds[executionId] }).catch(() => { delete this.executionIds[executionId] })
  }

  /**
   * This method will abort the current action instance execution. It returns a Promise that will resolve after abort.
   * Abort support is optional, most of the time not supported, especially for actions with quick executions.
   * For example a "wait and do something" action should support abort, while a log action is not long enough to be abortable...
   *
   * @param executionId - A unique execution ID, used with this.execute() to abort.
   * @returns {Promise} - A promise resolving when abort is done. If the action type is not abortable, the action will finish anyway, and the returned Promise will resolve. If the execution was already stopped (finished or already aborted), the returned promise will reject.
   * @public
   */
  abort (executionId) {
    // See comments in devtools log action for example of an abortable action
    return Promise.resolve(true)
  }

  /**
   * This method will try to abort each action instance execution in progress, of the current specific action type.
   *
   * @returns {Promise} - A promise resolving when all abort are done.
   * @public
   */
  abortAll () {
    const ids = Object.entries(this.executionIds).map(([executionId, v]) => executionId)
    return Promise.all(ids.map(executionId => ({ executionId, promise: this.abort(executionId) })))
    .then(results => {
      return { executionIds: results.map(r => r.executionId), result: results.reduce((acc, res) => acc & res, true) }
    }) // at least one false must give false
  }
}

export default ServerAction
