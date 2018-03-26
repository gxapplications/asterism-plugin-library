'use strict'

import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

/**
* This React component shows a collection of items, most often clickable for edition.
* At the end of the list, an item càn be added to let add other items.
*
* Component properties: {@link CollectionSetting.propTypes}.
*
* @example <caption>Use it in React JSX syntax</caption>
* <CollectionSetting TODO !D />
* @example https://github.com/gxapplications/asterism/blob/master/lib/ TODO !D
* @hideconstructor
* @public
*/
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
          <a key={idx} className={cx('collection-item avatar activator', { [waves]: el.onClick !== undefined })} href='#!' onClick={el.onClick}>
            <i className={cx('material-icons circle activator', el.icon)}>{el.icon || (el.onClick ? 'menu' : '')}</i>
            <span className='title truncate activator'>{el.title}</span>
            {el.details ? (<p className='truncate activator'>{el.details}</p>) : null}
            {el.secondary ? (
              <div onClick={el.secondary.onClick} className={cx('secondary-content', { [waves]: el.secondary.onClick !== undefined })}>
                <i className={cx('material-icons', el.secondary.icon)}>{el.secondary.icon || 'more_vert'}</i>
              </div>
            ) : null}
          </a>
        ))}
        {list.length ? (
          <a href='#!' className={cx('collection-item avatar activator trailing add', waves)} onClick={addElement.onClick}>
            <i className='material-icons circle activator'>add</i>
            <span className='title truncate activator'>{addElement.trailing.title || 'Add a new element'}</span>
          </a>
        ) : (
          <a href='#!' className={cx('collection-item big-avatar activator empty add', waves)} onClick={addElement.onClick}>
            <i className='material-icons circle activator'>{addElement.empty.icon || 'add'}</i>
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