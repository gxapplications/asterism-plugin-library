'use strict'

import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Icon } from 'react-materialize'

/** To desc */
class CollectionSetting extends React.Component {
  render () {
    const { animationLevel, list, header, addElement } = this.props
    const waves = animationLevel >= 2 ? 'waves-effect waves-light' : undefined

    return (
      <div className='collection'>
        {(header && header.length) ? (
          <div className='collection-item'>
            <h5 className='truncate'>{header}</h5>
          </div>
        ) : null}
        {list.map((el, idx) => (
          <a key={idx} className={cx('collection-item avatar activator', waves)} href='#!' onClick={el.onClick}>
            <Icon className='circle activator'>{el.icon || 'menu'}</Icon>
            <span className='title truncate activator'>{el.title}</span>
            {el.details ? (<p className='truncate activator'>{el.details}</p>) : null}
            {el.secondary ? (
              <div onClick={el.secondary.onClick} className={cx('secondary-content', waves)}>
                <Icon>{el.secondary.icon || 'more_vert'}</Icon>
              </div>
            ) : null}
          </a>
        ))}
        {list.length ? (
          <a href='#!' className={cx('collection-item avatar activator trailing add', waves)} onClick={addElement.onClick}>
            <Icon className='circle activator'>add</Icon>
            <span className='title truncate activator'>{addElement.trailing.title || 'Add a new element'}</span>
          </a>
        ) : (
          <a href='#!' className={cx('collection-item big-avatar activator empty add', waves)} onClick={addElement.onClick}>
            <Icon className='circle activator'>{addElement.empty.icon || 'add'}</Icon>
            <span className='title truncate activator'>{addElement.empty.title || 'Add a first element'}</span>
          </a>
        )}
      </div>
    )
  }
}

CollectionSetting.propTypes = {
  theme: PropTypes.object.isRequired,
  animationLevel: PropTypes.number.isRequired,
  list: PropTypes.array.isRequired,
  header: PropTypes.string,
  addElement: PropTypes.object.isRequired
}

CollectionSetting.defaultProps = {
  header: ''
}

export default CollectionSetting
