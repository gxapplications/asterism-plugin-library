'use strict'

/* global $ */
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Select, Icon } from 'react-materialize'

/**
 * This React component shows a dropdown with available scenarii elements of 'action' type.
 * This is use to choose an existing action (that is public, so not inside another scenarii element like a procedure)
 * or to create a new one on the fly (optional).
 * You can filter actions you want with a type filter as a callback, select default element, etc...
 *
 * @example <caption>Example of an ActionDropdown. Use it in React JSX syntax</caption>
 * <ActionsDropdown defaultActionId={this.state.actionId} onChange={this.actionChanged.bind(this)}
 *   theme={theme} animationLevel={animationLevel} services={services} />
 *
 * @see https://github.com/gxapplications/asterism/blob/master/lib/plugins/scenarii/base-elements/action-aborter/edit-form.jsx#L32
 * @hideconstructor
 * @memberof module:Scenarii
 * @public
 */
class ActionsDropdown extends React.Component {
  /**
   * React properties to use on this component.
   *
   * @property {object} services - The asterism services object. Often available from the parent component, or in the mainState object of a context.
   * @property {object} theme - The asterism theme object. Often available from the parent component, or in the mainState object of a context.
   * @property {number} animationLevel - The asterism main parameter for visual animations. Often available from the parent component, or in the mainState object of a context.
   * @property {string} defaultActionId - The action ID to pre-select at initialization.
   * @property {function} onChange - A callback when the user made a choice (in case of "new action" choice, called only after the element creation).
   * @property {string} dropdownId - An ID, just in order to be able to make a dom query on it...
   * @property {string} parentIdForNewInstance - Optional parent ID element for creation of a "new action" case. In that case, the new element will not appear in the main action list! None by default.
   * @property {string} label - The label to put above the input, in the user interface.
   * @property {string} icon - The icon to put on the left of the input, in the user interface.
   * @property {boolean} noCreationPanel - True to avoid opening a popin (a modal frame with settings of the new element). False by default.
   * @property {function} typeFilter - A filter to choose what type of new actions can be created from the dropdown.
   * @property {function} instanceFilter - A filter to choose what existing public actions should be listed in the dropdown.
   * @public
   */
  static propTypes = {
    services: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    animationLevel: PropTypes.number.isRequired,
    defaultActionId: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    dropdownId: PropTypes.string,
    parentIdForNewInstance: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.string,
    noCreationPanel: PropTypes.bool,
    typeFilter: PropTypes.func,
    instanceFilter: PropTypes.func
  }

  /**
   * Default properties values.
   *
   * @property {string} defaultActionId - null (no selection, the first item will be selected at display time).
   * @property {string} dropdownId - '0' by default, to override if you need to query its DOM element.
   * @property {string} parentIdForNewInstance - null by default (so, public element shown in the actions list).
   * @property {string} label - 'Action'.
   * @property {string} icon - 'error' (default icon for actions).
   * @property {boolean} noCreationPanel - false (allows creation panel).
   * @property {function} typeFilter - () => true (allows all types).
   * @property {function} instanceFilter - () => true (allows all existing public actions).
   * @public
   */
  static defaultProps = {
    defaultActionId: null,
    dropdownId: '0',
    parentIdForNewInstance: null,
    label: 'Action',
    icon: 'error',
    noCreationPanel: false,
    typeFilter: () => true,
    instanceFilter: () => true
  }

  constructor (props) {
    super(props)

    this.scenariiService = props.services()['asterism-scenarii']

    this.state = {
      instances: [],
      types: [],
      creatingInstance: null,
      currentId: props.defaultActionId
    }

    this._editFormInstance = null
  }

  componentDidMount () {
    this.scenariiService.getActionTypes().then((types) => {
      return this.scenariiService.getActionInstances()
        .then((instances) => {
          instances = instances.filter(i => !!i).filter(this.props.instanceFilter)
          const newState = {
            types: types.filter(this.props.typeFilter).map((type) => ({
              id: type.id,
              type: type.type,
              onClick: () => {
                this.scenariiService.createActionInstance(type.id).then((newAction) => {
                  if (this.props.noCreationPanel) {
                    this.confirmNewInstance(newAction)
                  } else {
                    this.setState({
                      creatingInstance: newAction
                    })
                  }
                })
              }
            })),
            instances
          }
          if (this.state.currentId && !instances.find(i => i.instanceId === this.state.currentId)) {
            newState.currentId = null
            this.props.onChange('')
          }
          this.setState(newState)
        })
    })
  }

  componentDidUpdate () {
    if (this.state.creatingInstance) {
      $(`#actions-dropdown-modal-${this.props.dropdownId}`).detach().appendTo('#app')
      $(`#actions-dropdown-modal-${this.props.dropdownId}`).modal({ dismissible: false })
      $(`#actions-dropdown-modal-${this.props.dropdownId}`).modal('open')
    }
  }

  render () {
    const { theme, animationLevel, dropdownId, services, label, icon, children = [] } = this.props
    const { types, instances, creatingInstance, currentId } = this.state

    const EditForm = (creatingInstance && creatingInstance.EditForm) || null
    const childrenCount = ((children || []).length >= 0) ? (children || []).length : 1

    return (
      <div id={`actions-dropdown-modal-anchor-${dropdownId}`}>
        <Select s={12} label={label} icon={icon} onChange={this.valueChanged.bind(this)} value={currentId || ''}>
          {(instances.length + childrenCount) > 0 ? <option key='no-option-choosed' value='' disabled>Please choose an action</option> : []}
          {children || []}
          {instances.map((instance, idx) => (
            <option key={instance.instanceId} value={instance.instanceId}>{instance.shortLabel}</option>
          ))}
          {types.length > 0 ? <option key='no-type-choosed' value='' disabled>{(instances.length + childrenCount) > 0 ? 'Or create a new one from these:' : 'Choose an action to create'}</option> : []}
          {types.map(({ id, type, onClick }, idx) => (
            <option key={type.name} value={id}>+ {type.shortLabel || type.name}</option>
          ))}
        </Select>
        {creatingInstance ? (
          <div id={`actions-dropdown-modal-${dropdownId}`} className={cx('modal modal-fixed-footer actions-dropdown-edit-panel', theme.backgrounds.body)}>
            <div className='modal-content'>
              <div className={cx('coloring-header', theme.backgrounds.editing)}>
                <h4>{EditForm.label || 'Action configuration'}</h4>
              </div>
              <div>
                <EditForm
                  ref={(c) => { this._editFormInstance = c }}
                  instance={creatingInstance} services={services}
                  theme={theme} animationLevel={animationLevel}
                />
              </div>
            </div>
            <div className={cx('modal-footer', theme.backgrounds.body)}>
              <a
                href='#!' onClick={this.confirmNewInstance.bind(this, creatingInstance)}
                className={cx(
                  'modal-action btn-flat',
                  { 'waves-effect waves-green': animationLevel >= 3 }
                )}
              >
                <Icon left>check</Icon> Ok
              </a>

              <a
                href='#!' onClick={this.cancelNewInstance.bind(this, creatingInstance)}
                className={cx(
                  'modal-action btn-flat',
                  { 'waves-effect waves-red': animationLevel >= 3 }
                )}
              >
                <Icon left>clear</Icon> Cancel
              </a>
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  valueChanged (event) {
    const currentId = event.currentTarget.value
    const type = this.state.types.find((type) => type.id === currentId)
    if (type) {
      type.onClick()
    } else {
      this.setState({ currentId })
      return this.props.onChange(currentId)
    }
  }

  confirmNewInstance (creatingInstance) {
    this.scenariiService.setActionInstance(creatingInstance, this.props.parentIdForNewInstance)
      .then(() => {
        const instances = [...this.state.instances, creatingInstance]
        $(`#actions-dropdown-modal-${this.props.dropdownId}`).modal('close')
        $(`#actions-dropdown-modal-${this.props.dropdownId}`).detach().appendTo(`#actions-dropdown-modal-anchor-${this.props.dropdownId}`)
        this.setState({ instances, currentId: creatingInstance.instanceId, creatingInstance: null })
        this.props.onChange(creatingInstance.instanceId)
      })
  }

  cancelNewInstance (creatingInstance) {
    $(`#actions-dropdown-modal-${this.props.dropdownId}`).modal('close')
    $(`#actions-dropdown-modal-${this.props.dropdownId}`).detach().appendTo(`#actions-dropdown-modal-anchor-${this.props.dropdownId}`)
    setTimeout(() => {
      this.setState({
        creatingInstance: null
      })
    }, 250)
    this._editFormInstance = null
  }
}

export default ActionsDropdown
