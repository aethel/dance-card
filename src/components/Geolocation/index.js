import React from 'react';
import GeolocationContext from './context';
import { withFirebase } from '../Firebase';

const withGeolocation = Component => {
  class WithGeolocation extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        location: null,
        geoPoint: null,
        error: null
      };
    }

    componentDidMount() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const geoPoint = this.props.firebase.geoPoint(
            position.coords.latitude,
            position.coords.longitude
          );
          this.setState({
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            geoPoint
          });
        });
      } else {
        this.setState({ error: 'Geolocation unavailable' });
        console.warn('no geolocation');
      }
    }

    render() {
      return (
        <GeolocationContext.Provider value={this.state}>
          <Component {...this.props} />
        </GeolocationContext.Provider>
      );
    }
  }

  return withFirebase(WithGeolocation);
};

export default withGeolocation;
