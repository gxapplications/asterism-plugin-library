'use strict'

/* global $ */
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Input, Icon } from 'react-materialize'

class ScenariiDropdown extends React.Component {
  constructor (props) {
    super(props)

    this.scenariiService = props.services()['asterism-scenarii']

    this.state = {
      instances: [],
      types: [],
      creatingInstance: null,
      currentId: props.defaultScenarioId
    }

    this._editFormInstance = null
  }

  componentDidMount () {
    this.scenariiService.getScenarioTypes().then((types) => {
      return this.scenariiService.getScenarioInstances()
      .then((instances) => {
        instances = instances.filter(this.props.instanceFilter)
        this.setState({
          types: types.filter(this.props.typeFilter).map((type) => ({
            id: type.id,
            type: type.type,
            onClick: () => {
              this.scenariiService.createScenarioInstance(type.id).then((newScenario) => {
                if (this.props.noCreationPanel) {
                  this.confirmNewInstance(newScenario)
                } else {
                  this.setState({
                    creatingInstance: newScenario
                  })
                }
              })
            }
          })),
          instances
        })

        if (instances.length >= 1 && !this.state.currentId && !this.props.noCreationPanel) {
          this.setState({ currentId: instances[0].instanceId })
          this.props.onChange(instances[0].instanceId)
        }
      })
    })
  }

  componentDidUpdate () {
    if (this.state.creatingInstance) {
      $(`#scenarii-dropdown-modal-${this.props.dropdownId}`).detach().appendTo('#app')
      $(`#scenarii-dropdown-modal-${this.props.dropdownId}`).modal({ dismissible: false })
      $(`#scenarii-dropdown-modal-${this.props.dropdownId}`).modal('open')
    }
  }

  render () {
    const { theme, animationLevel, dropdownId, services, label, icon, children } = this.props
    const { types, instances, creatingInstance, currentId } = this.state

    const EditForm = (creatingInstance && creatingInstance.EditForm) || null

    return (
      <div id={`scenarii-dropdown-modal-anchor-${dropdownId}`}>
        <Input s={12} label={label} type='select' icon={icon} onChange={this.valueChanged.bind(this)} value={currentId || undefined}>
          {children || []}
          {instances.map((instance, idx) => (
            <option key={instance.instanceId} value={instance.instanceId}>{instance.shortLabel}</option>
          ))}
          {types.map(({ id, type, onClick }, idx) => (
            <option key={type.name} value={id}>+ {type.shortLabel || type.name}</option>
          ))}
        </Input>
        {creatingInstance ? (
          <div id={`scenarii-dropdown-modal-${dropdownId}`} className={cx('modal modal-fixed-footer scenarii-dropdown-edit-panel', theme.backgrounds.body)}>
            <div className='modal-content'>
              <div className={cx('coloring-header', theme.backgrounds.editing)}>
                <h4>{EditForm.label || 'Scenario configuration'}</h4>
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
    this.scenariiService.setScenarioInstance(creatingInstance, this.props.parentIdForNewInstance)
    .then(() => {
      const instances = [...this.state.instances, creatingInstance]
      $(`#scenarii-dropdown-modal-${this.props.dropdownId}`).modal('close')
      $(`#scenarii-dropdown-modal-${this.props.dropdownId}`).detach().appendTo(`#scenarii-dropdown-modal-anchor-${this.props.dropdownId}`)
      this.setState({ instances, currentId: creatingInstance.instanceId, creatingInstance: null })
      this.props.onChange(creatingInstance.instanceId)
    })
  }

  cancelNewInstance (creatingInstance) {
    $(`#scenarii-dropdown-modal-${this.props.dropdownId}`).modal('close')
    $(`#scenarii-dropdown-modal-${this.props.dropdownId}`).detach().appendTo(`#scenarii-dropdown-modal-anchor-${this.props.dropdownId}`)
    setTimeout(() => {
      this.setState({
        creatingInstance: null
      })
    }, 250)
    this._editFormInstance = null
  }
}

ScenariiDropdown.propTypes = {
  services: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  animationLevel: PropTypes.number.isRequired,
  defaultScenarioId: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  dropdownId: PropTypes.string,
  parentIdForNewInstance: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.string,
  noCreationPanel: PropTypes.bool,
  typeFilter: PropTypes.func,
  instanceFilter: PropTypes.func
}

ScenariiDropdown.defaultProps = {
  defaultScenarioId: null,
  dropdownId: '0',
  parentIdForNewInstance: null,
  label: 'Scenario',
  icon: 'offline_pin',
  noCreationPanel: true,
  typeFilter: () => false,
  instanceFilter: () => true
}

export default ScenariiDropdown
