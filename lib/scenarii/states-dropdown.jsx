'use strict'

/* global $ */
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Select, Icon } from 'react-materialize'

/**
 * This React component shows a dropdown with available scenarii elements of 'state' type.
 * This is use to choose an existing state (that is public, so not inside another scenarii element like a procedure)
 * or to create a new one on the fly (optional).
 * You can filter states you want with a type filter as a callback, select default element, etc...
 *
 * @example <caption>Example of an StatesDropdown. Use it in React JSX syntax</caption>
 * <StatesDropdown defaultStateId={this.state.stateId} onChange={this.stateChanged.bind(this)}
 *   theme={theme} animationLevel={animationLevel} services={services} />
 *
 * @see https://github.com/gxapplications/asterism/blob/master/lib/plugins/scenarii/base-elements/level-state-changer/edit-form.jsx#L76
 * @hideconstructor
 * @memberof module:Scenarii
 * @public
 */
class StatesDropdown extends React.Component {
  /**
   * React properties to use on this component.
   *
   * @property {object} services - The asterism services object. Often available from the parent component, or in the mainState object of a context.
   * @property {object} theme - The asterism theme object. Often available from the parent component, or in the mainState object of a context.
   * @property {number} animationLevel - The asterism main parameter for visual animations. Often available from the parent component, or in the mainState object of a context.
   * @property {string} defaultStateId - The state ID to pre-select at initialization.
   * @property {function} onChange - A callback when the user made a choice (in case of "new state" choice, called only after the element creation).
   * @property {string} dropdownId - An ID, just in order to be able to make a dom query on it...
   * @property {function} typeFilter - A filter to choose what type of new states can be created from the dropdown.
   * @property {function} instanceFilter - A filter to choose what existing public states should be listed in the dropdown.
   * @property {string} label - The label to put above the input, in the user interface.
   * @public
   */
  static propTypes = {
    services: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    animationLevel: PropTypes.number.isRequired,
    defaultStateId: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    dropdownId: PropTypes.string,
    typeFilter: PropTypes.func,
    instanceFilter: PropTypes.func,
    label: PropTypes.string
  }

  /**
   * Default properties values.
   *
   * @property {string} defaultStateId - null (no selection, the first item will be selected at display time).
   * @property {string} dropdownId - '0' by default, to override if you need to query its DOM element.
   * @property {function} typeFilter - () => true (allows all types).
   * @property {function} instanceFilter - () => true (allows all existing public states).
   * @property {string} label - 'State'.
   * @public
   */
  static defaultProps = {
    defaultStateId: null,
    dropdownId: '0',
    typeFilter: () => true,
    instanceFilter: () => true,
    label: 'State'
  }

  constructor (props) {
    super(props)

    this.scenariiService = props.services()['asterism-scenarii']

    this.state = {
      instances: [],
      types: [],
      creatingInstance: null,
      currentId: props.defaultStateId
    }

    this._editFormInstance = null
  }

  componentDidMount () {
    this.scenariiService.getStateTypes().then((types) => {
      return this.scenariiService.getStateInstances()
      .then((instances) => {
        instances = instances.filter(i => !!i).filter(this.props.instanceFilter)

        this.setState({
          types: types.filter(this.props.typeFilter).map((type) => ({
            id: type.id,
            type: type.type,
            onClick: () => {
              this.scenariiService.createStateInstance(type.id).then((newState) => {
                this.setState({
                  creatingInstance: newState
                })
              })
            }
          })),
          instances
        })
      })
    })
  }

  componentDidUpdate () {
    if (this.state.creatingInstance) {
      $(`#states-dropdown-modal-${this.props.dropdownId}`).detach().appendTo('#app')
      $(`#states-dropdown-modal-${this.props.dropdownId}`).modal({ dismissible: false })
      $(`#states-dropdown-modal-${this.props.dropdownId}`).modal('open')
    }
  }

  render () {
    const { theme, animationLevel, dropdownId, services, children = [], label } = this.props
    const { types, instances, creatingInstance, currentId } = this.state

    const EditForm = (creatingInstance && creatingInstance.EditForm) || null
    const childrenCount = ((children || []).length >= 0) ? (children || []).length : 1

    return (
      <div id={`states-dropdown-modal-anchor-${dropdownId}`}>
        <Select s={12} label={label} icon='error' onChange={this.valueChanged.bind(this)} value={currentId || ''}>
          {(instances.length + childrenCount) > 0 ? <option key='no-option-choosed' value={''} disabled>Please choose a state</option> : []}
          {children || []}
          {instances.map((instance, idx) => (
            <option key={instance.instanceId} value={instance.instanceId}>{instance.shortLabel}</option>
          ))}
          {types.length > 0 ? <option key='no-type-choosed' value={''} disabled>{(instances.length + childrenCount) > 0 ? 'Or create a new one from these:' : 'Choose a state to create'}</option> : []}
          {types.map(({ id, type, onClick }, idx) => (
            <option key={type.name} value={id}>+ {type.shortLabel || type.name}</option>
          ))}
        </Select>
        {creatingInstance ? (
          <div id={`states-dropdown-modal-${dropdownId}`} className={cx('modal modal-fixed-footer actions-dropdown-edit-panel', theme.backgrounds.body)}>
            <div className='modal-content'>
              <div className={cx('coloring-header', theme.backgrounds.editing)}>
                <h4>{EditForm.label || 'State configuration'}</h4>
              </div>
              <div>
                <EditForm ref={(c) => { this._editFormInstance = c }}
                  instance={creatingInstance} services={services}
                  theme={theme} animationLevel={animationLevel}
                />
              </div>
            </div>
            <div className={cx('modal-footer', theme.backgrounds.body)}>
              <a href='#!' onClick={this.confirmNewInstance.bind(this, creatingInstance)} className={cx(
                'modal-action btn-flat',
                { 'waves-effect waves-green': animationLevel >= 3 }
              )}><Icon left>check</Icon> Ok</a>

              <a href='#!' onClick={this.cancelNewInstance.bind(this, creatingInstance)} className={cx(
                'modal-action btn-flat',
                { 'waves-effect waves-red': animationLevel >= 3 }
              )}><Icon left>clear</Icon> Cancel</a>
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
    this.scenariiService.setStateInstance(creatingInstance)
    .then(() => {
      const instances = [...this.state.instances, creatingInstance]
      $(`#states-dropdown-modal-${this.props.dropdownId}`).modal('close')
      $(`#states-dropdown-modal-${this.props.dropdownId}`).detach().appendTo(`#states-dropdown-modal-anchor-${this.props.dropdownId}`)
      this.setState({ instances, currentId: creatingInstance.instanceId, creatingInstance: null })
      this.props.onChange(creatingInstance.instanceId)
    })
  }

  cancelNewInstance (creatingInstance) {
    $(`#states-dropdown-modal-${this.props.dropdownId}`).modal('close')
    $(`#states-dropdown-modal-${this.props.dropdownId}`).detach().appendTo(`#states-dropdown-modal-anchor-${this.props.dropdownId}`)
    setTimeout(() => {
      this.setState({
        creatingInstance: null
      })
    }, 250)
    this._editFormInstance = null
  }
}

export default StatesDropdown
