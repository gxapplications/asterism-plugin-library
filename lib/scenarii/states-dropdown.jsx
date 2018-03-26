'use strict'

/* global $ */
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Input, Icon } from 'react-materialize'

class StatesDropdown extends React.Component {
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
        this.setState({
          types: types.map((type) => ({
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

        if (instances.length >= 1 && !this.state.currentId) {
          this.setState({ currentId: instances[0].instanceId })
          this.props.onChange(instances[0].instanceId)
        }
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
    const { theme, animationLevel, dropdownId, services, children } = this.props
    const { types, instances, creatingInstance, currentId } = this.state

    const EditForm = (creatingInstance && creatingInstance.EditForm) || null

    return (
      <div id={`states-dropdown-modal-anchor-${dropdownId}`}>
        <Input s={12} label='State' type='select' icon='error' onChange={this.valueChanged.bind(this)} value={currentId}>
          {children || []}
          {instances.map((instance, idx) => (
            <option key={instance.instanceId} value={instance.instanceId}>{instance.shortLabel}</option>
          ))}
          {types.map(({ id, type, onClick }, idx) => (
            <option key={type.name} value={id}>+ {type.shortLabel || type.name}</option>
          ))}
        </Input>
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
    const currentId = event.target.value
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

StatesDropdown.propTypes = {
  services: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  animationLevel: PropTypes.number.isRequired,
  defaultStateId: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  dropdownId: PropTypes.string
}

StatesDropdown.defaultProps = {
  defaultStateId: null,
  dropdownId: '0'
}

export default StatesDropdown
