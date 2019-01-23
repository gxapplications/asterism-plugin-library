'use strict'

import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

/**
* This React component shows a collection of items, most often clickable for edition.
* At the end of the list, an item can be added to let add more items.
*
* Default header is to have no header (empty string)
*
* @example <caption>Use it in React JSX syntax</caption>
* <CollectionSetting
*     theme={theme}
*     animationLevel={animationLevel}
*     list={
*         elements.map((el) => ({
*             title: el.name || 'Unnamed',
*             icon: 'favorite',
*             onClick: this.configureElement.bind(this, el),
*             details: el.details || 'No more details',
*             css: 'my-class',
*             secondary: {
*                 icon: 'more_vert',
*                 onClick: () => {},
*             }
*         }))
*     }
*     header='My elements list'
*     addElement={{
*         empty: { title: 'Add your first element here', icon: 'add' },
*         trailing: { title: 'Add an element' },
*         onClick: this.addElement.bind(this)
*     }}
* />
*
* @see https://github.com/gxapplications/asterism-plugin-ipcam/blob/master/lib/settings.jsx
* @hideconstructor
* @memberof module:asterism-plugin-library
* @public
*/
class CollectionSetting extends React.Component {
  /**
   * React properties to use on this component.
   *
   * @property {object} theme - The asterism theme object. Often available from the parent component, or in the mainState object of a context.
   * @property {number} animationLevel - The asterism main parameter for visual animations. Often available from the parent component, or in the mainState object of a context.
   * @property {object[]} list - The elements as an objects array. See above example for object attributes to insert here.
   * @property {string} header - The header displayed above the collection.
   * @property {object} addElement - An object containing empty list case and a 'add element' trailing item. See above example for object attributes to insert here.
   * @public
   */
  static propTypes = {
    theme: PropTypes.object.isRequired,
    animationLevel: PropTypes.number.isRequired,
    list: PropTypes.array.isRequired,
    header: PropTypes.string,
    addElement: PropTypes.object
  }

  /**
   * Default properties values.
   * @property {string} header - ""
   * @public
   */
  static defaultProps = {
    header: ''
  }

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
          <a key={idx} className={cx('collection-item avatar activator', { [waves]: el.onClick !== undefined }, el.css)} href='#!' onClick={el.onClick}>
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
          (addElement && addElement.trailing) ? <a href='#!' className={cx('collection-item avatar activator trailing add', waves)} onClick={addElement.onClick}>
            <i className='material-icons circle activator'>{(addElement.trailing && addElement.trailing.icon) || 'add'}</i>
            <span className='title truncate activator'>{(addElement.trailing && addElement.trailing.title) || 'Add a new element'}</span>
          </a> : null
        ) : (
          (addElement && addElement.empty) ? <a href='#!' className={cx('collection-item big-avatar activator empty add', waves)} onClick={addElement.onClick}>
            <i className='material-icons circle activator'>{(addElement.empty && addElement.empty.icon) || 'add'}</i>
            <span className='title truncate activator'>{(addElement.empty && addElement.empty.title) || 'Add a first element'}</span>
          </a> : <a nohref className={cx('collection-item big-avatar activator empty add')}>
            <span className='title truncate activator'>There is nothing to show here.</span>
          </a>
        )}
      </div>
    )
  }
}

export default CollectionSetting
