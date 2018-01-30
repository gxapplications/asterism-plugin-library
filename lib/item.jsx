'use strict'

import PropTypes from 'prop-types'
import React from 'react'

/** Base class representing an item on the dashboard. Extends it for your own item type. */
class Item extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      params: { ...props.initialParams } // clone it, props are immutable unlike state
    }
  }

  /** If you need to override this, please ensure you call super.receiveNewParams(), or at least set your item state with the whole new params data */
  receiveNewParams (params) {
    this.setState({ params })
    this.params = params
    console.log(`New params received for item #${this.props.id}.`)
  }
}

Item.propTypes = {
  id: PropTypes.string.isRequired,
  initialParams: PropTypes.object,
  context: PropTypes.object.isRequired,
  acceptedDimensions: PropTypes.array.isRequired
}

Item.defaultProps = {
  initialParams: {}
}

export default Item
