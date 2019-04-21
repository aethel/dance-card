import React from 'react';
import GeolocationContext from './context';

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
          this.setState({
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
          const geoPoint = this.props.firebase.geoPoint(
            position.coords.latitude,
            position.coords.longitude
          );
          this.setState({ geoPoint });
          console.log(this.state);
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

  return WithGeolocation;
};

export default withGeolocation;
