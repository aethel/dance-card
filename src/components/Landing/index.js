import React, { Component } from 'react'
import { geolocated } from 'react-geolocated'

class Landing extends Component {
  render() {
    const { isGeolocationAvailable, isGeolocationEnabled, coords } = this.props
    console.log(coords)

    return (
      <React.Fragment>
        <div>available {isGeolocationAvailable}</div>
        <div>enabled {isGeolocationEnabled}</div>
        <div>{coords && coords.longitude}</div>
        <div>{coords && coords.latitude}</div>
      </React.Fragment>
    )
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true
  },
  userDecisionTimeout: 5000
})(Landing)
