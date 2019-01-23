'use strict'

/* global $ */
import PropTypes from 'prop-types'
import React from 'react'

import ItemFactoryBuilder from './item-factory-builder'

/**
* This React component is to overrdie by Item setting panel class definition.
* An Item setting panel is the modal shown when the user adds a new item on the dashboard,
* or when he wants to change an existing item parameters.
*
* ## render:
* The only mandatory element to implement in the superclass is the render method (as always for a React component)
* The returned value should be like this example:
* <div className='clearing padded'>
*   Put what you want here :)
*   <Button waves={waves} className={cx('right btn-bottom-sticky', theme.actions.primary)} onClick={this.save.bind(this)}>
*     Save &amp; close
*   </Button>
* </div>
*
* And the save method should call this.next(ClassItem, this.state.params) that will save parameters, close the panel and create the item on the dashboard.
*
* ## state:
* The component state contains precious objects to work with:
* - this.state.params: the item params, an object to store item attributes (settings to manipulate in the panel)
* - this.state.item: warning, this element can be null if the item has never been displayed (in a "new item" case). Set asynchronously from outside.
*
* See examples to start implementing your own superclass.
*
* @see https://github.com/gxapplications/asterism/blob/master/lib/plugins/navigation-tools/go-to-path-button/setting-panel.jsx
* @see https://github.com/gxapplications/asterism/blob/master/lib/plugins/scenarii/action-button/setting-panel.jsx
* @hideconstructor
* @memberof module:Asterism
* @public
* @abstract
*/
class ItemSettingPanel extends React.Component {
  /**
   * React properties to use on this component.
   *
   * @property {string} icon - Icon show on the setting panel header.
   * @property {string} title - The setting panel title, shown on the header.
   * @property {string} id - The item ID.
   * @property {object} item - The item object, to use in extrem cases only.
   * @property {object} initialParams - The initial params to use to initialize the item. To use as default params objects.
   * @property {function} save - Used in the next() method (or manually if needed) to save item params to persistance layer.
   * @property {integer} preferredHeight - The height that will be used when the item is shown the first time on the dashboard (see ItemFactoryBuilder class).
   * @property {integer} preferredWidth - The width that will be used when the item is shown the first time on the dashboard (see ItemFactoryBuilder class).
   * @property {object[]} acceptedDimensions - Array of simple object of type { w: X, h: Y }, X and Y between 1 to 3, to describe accepted dimensions for the item (see ItemFactoryBuilder class).
   * @property {function} settingPanelCallback - The method callled by next() method after saving/updating the item and its params, to close the panel and refresh dashboard.
   * @property {object} context - The asterism context given to have links to services or usefull objects.
   * @public
   */
  static propTypes = {
    icon: PropTypes.string,
    title: PropTypes.string,
    id: PropTypes.string.isRequired,
    item: PropTypes.object,
    initialParams: PropTypes.object,
    save: PropTypes.func.isRequired,
    preferredHeight: PropTypes.number,
    preferredWidth: PropTypes.number,
    acceptedDimensions: PropTypes.array.isRequired,
    settingPanelCallback: PropTypes.func.isRequired, // should be called without args if props.item is not null, else
    // should return a full new structure : { id,item,preferredHeight,preferredWidth,settingPanel(optional) }
    context: PropTypes.object.isRequired
  }

  /**
   * Default properties values.
   *
   * @property {string} icon - Default to no icon.
   * @property {string} title - Default to no title.
   * @property {object} item - The item object, default to null (this is the case for an instance creation, not for a setting update of an existing item).
   * @property {object} initialParams - Default to empty object. Filled by previous item params for a setting update of an existing item.
   * @property {integer} preferredHeight - Default to 1.
   * @property {integer} preferredWidth - Default to 1.
   * @property {object[]} acceptedDimensions - Default to [{ w: 1, h: 1 }].
   * @public
   */
  static defaultProps = {
    icon: '',
    title: '',
    item: null,
    initialParams: {},
    preferredHeight: 1,
    preferredWidth: 1,
    acceptedDimensions: [{ w: 1, h: 1 }]
  }

  constructor (props) {
    super(props)
    this.state = {
      params: { ...props.initialParams },
      item: null // will be set by a ItemLinker instance
    }
  }

  /**
   * A useful method to store a new value in a named parameter.
   *
   * @example <caption>Can use it in React JSX syntax</caption>
   * <ActionsDropdown defaultActionId={action} onChange={this.handleValueChange.bind(this, 'action')}
   *   ref={(c) => { this._action = c }} theme={theme} animationLevel={animationLevel}
   *   services={() => this.props.context.services} />
   *
   * @param {string} field - The attribute name to store the value in this.state.params, as a string
   * @param {object} value - The raw value to insert/update in the params.
   */
  handleValueChange (field, value) {
    this.setState({ params: { ...this.state.params, [field]: value } })
  }

  /**
   * A useful method to store a new value in a named parameter.
   * This is a variation of handleValueChange, that will take a HTML DOM event as parameter instead of a raw value,
   * to look into it event.target.value.
   *
   * @example <caption>Can use it in React JSX syntax</caption>
   * <Input s={12} label='Label' ref={(c) => { this._title = c }}
   *   value={title} onChange={this.handleEventChange.bind(this, 'title')}>
   *
   * @param {string} field - The attribute name to store the value in this.state.params, as a string
   * @param {object} event - The HTML DOM event triggered, containing the value to store into the params.
   */
  handleEventChange (field, event) {
    this.setState({ params: { ...this.state.params, [field]: event.target.value } })
  }

  /**
   * Call this method when the settings are ok and the user wants to validate them, create/update the item and close the panel.
   *
   * @param {class} ItemClass - The Item class, to let asterism know what type of Item it should create. Most of the time this should be a static import of a class, but can also be dynamic!
   * @param {object} params - In most of the cases, this.state.params
   */
  next (ItemClass, params) {
    const { id, save, preferredHeight, preferredWidth, settingPanelCallback, acceptedDimensions, context } = this.props
    const { item } = this.state

    if (item) {
      // it's an item update, return nothing but update item here
      save(params)
      .then(() => {
        if (item.receiveNewParams) {
          item.receiveNewParams(params)
        }
        settingPanelCallback()
      })
    } else {
      // it's a new item creation, return the full structure
      save(params)
      .then(() => {
        const itemLinker = new ItemFactoryBuilder.ItemLinker()
        const newItem = <ItemClass id={id} initialParams={params} context={context} ref={(c) => itemLinker.receiveItem(c)} acceptedDimensions={acceptedDimensions} />
        const newSettingPanel = <this.constructor ref={(c) => itemLinker.receiveItemSettingPanel(c)}
          icon={this.props.icon} title={this.props.title}
          id={id} initialParams={params} item={newItem} context={context}
          save={save} acceptedDimensions={acceptedDimensions} settingPanelCallback={settingPanelCallback} />
        return settingPanelCallback({
          id,
          item: newItem,
          preferredHeight,
          preferredWidth,
          settingPanel: newSettingPanel
        })
      })
    }
  }

  gotToSettings (tabId) {
    $('#item-setting-modal').modal('close')
    setTimeout(() => {
      this.props.context.mainState.set({ itemSettingPanel: null })
      $('#settings-modal').modal('open')
      try {
        const id = $(`#${tabId}`).parent().attr('id')
        setTimeout(() => {
          $('#settings-modal ul.tabs').tabs('select_tab', id)
        }, 400)
      } catch (error) {
        console.error(error)
      }
    }, 400)
  }
}

export default ItemSettingPanel
