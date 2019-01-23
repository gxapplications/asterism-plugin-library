'use strict'

import PropTypes from 'prop-types'
import React from 'react'

/**
* Base class representing an item on the dashboard. Extends it for your own item type.
*
*
* ## Declaring a new Item type
*
* To declare an Item in a plugin, you must use an ItemFactory and declare it into your plugin manifest
* { browser: { itemFactory: '...path to your factory class...' } }.
*
* See [ItemFactoryBuilder]{@link ItemFactoryBuilder} for more information.
*
*
* ## Dependencies injection
*
* Since the component will be instantiated by asterism itself, you cannot inject your own properties.
* If you need to call your own services or sockets for example, declare them properly into the manifest of your plugin,
* through { browser: { services: (context) => [my-services], publicSockets: [my-public-sockets] } }
* then your dependencies will be available in the context property. See below example.
*
*
* ## State content
*
* The component state is initialized with a params object containing item parameters (a deep copy of this.props.initialParameters):
*
* ```
* {
*     params: { ... }
* }
* ```
*
* This params state is updated by asterism through this.receiveNewParams().
* In your constructor, do never replace this.state, but use this.setState({ ...partial state... }) instead.
*
*
* ## Context content
*
* The context from props will serve a lot of usefull elements:
*
* ```
* {
*     services: array of services (e.g: const scenariiService = context.services['asterism-scenarii']. See {@tutorial services},
*     localStorage: LocalStorage (an engine to get/set values, stored on the browser side only, for this user only. See {@tutorial local-storage},
*     serverStorage: ServerStorage (an engine to get/set value, stored on the server side, shared with all users. See {@tutorial server-storage}),
*     theme: Theme (The material theme parameters. See {@tutorial theme}),
*     privateSocket: Socket (a Socket.io socket instance, private: for your plugin only),
*     publicSockets: object (with public/shared Socket.io sockets, indexed by their path identifier. You must know their use to call them. See {@tutorial socket})
*     mainState: function (e.g: to get the main state, do a context.mainState() ; to make a set, do a context.mainState.set(...))
* }
* ```
*
*
* @example <caption>Example of a constructor that links context objects (services, sockets, ...)</caption>
* class MyItem extends Item {
*     constructor (props) {
*         super(props)
*         const myService = props.context.services["my-service-id"];
*         const scenariiService = props.context.services["asterism-scenarii"];
*         const publicSocket = props.context.publicSockets["asterism/developer-tools/log"];
*         const privateSocket = props.context.privateSocket;
*     }
* }
*
* @hideconstructor
* @memberof module:asterism-plugin-library
* @public
* @abstract
*/
class Item extends React.Component {
  /**
   * React properties to use on this component.
   * You should not override these properties since you have no control on component instantiation (and then props injection).
   *
   * @property {string} id - The unique ID of the instance.
   * @property {object} initialParams - The parameters set into the component state a construction ('params' attribute). These params are updated from asterism through receiveNewParams(params).
   * @property {object} context - A context object containing useful services an other global properties. See the above details.
   * @property {array} acceptedDimensions - The dimensions (x/y) this item can take, injected through your ItemFactory instance.
   * @public
   */
  static propTypes = {
    id: PropTypes.string.isRequired,
    initialParams: PropTypes.object,
    context: PropTypes.object.isRequired,
    acceptedDimensions: PropTypes.array.isRequired
  }

  /**
   * Default properties values.
   * @property {object} initialParams - {}
   * @public
   */
  static defaultProps = {
    initialParams: {}
  }

  constructor (props) {
    super(props)
    this.state = {
      params: { ...props.initialParams } // clone it, props are immutable unlike state
    }
  }

  /**
   * Called by asterism when the item may receive new params (from an ItemSettingPanel for example).
   * If you need to override this, please ensure you call super.receiveNewParams() or at least do the same thing.
   */
  receiveNewParams (params) {
    this.setState({ params })
    this.params = params
    console.log(`New params received for item #${this.props.id}.`)
  }
}

export default Item
