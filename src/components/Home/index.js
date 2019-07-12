import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import {
  withAuthorisation,
  withAuthentication,
  AuthUserContext
} from '../Session';
import DanceMap from '../Map';
import withGeolocation from '../Geolocation';
import GeolocationContext from '../Geolocation/context';
import { log } from 'util';

const HomePage = () => (
  <section>
    <GeolocationContext.Consumer>
      {location => (
        <AuthUserContext.Consumer>
          {authUser => <Home geolocation={location} user={authUser} />}
        </AuthUserContext.Consumer>
      )}
    </GeolocationContext.Consumer>
  </section>
);

const condition = authUser => !!authUser;

class HomeBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      users: [],
      location: null,
      radius: 50
    };
  }

  async componentDidMount() {
    const uid = sessionStorage.getItem('uid');
    console.log(uid);
//if user denies geolocation, load latest saved position? otherwise, if new position differs from stored, update stored    
    // this.setUsersLocation(uid);
  }

  componentDidUpdate(prevProps) {
    if (this.props.geolocation.location !== prevProps.geolocation.location) {
      const location = this.props.firebase.geoPoint(
        this.props.geolocation.location.lat,
        this.props.geolocation.location.lng
      );
      this.setState({ location });
      this.setUsers(location);
    }
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (prevState.radius !== this.state.radius) {
      this.setState({ users: [] });
      this.setUsers(this.state.location);
    }
  }

    setUsers = location => {
    // const { location } = this.state;
    if (!location) {
      return false;
    }
    const snapshot = this.props.firebase
      .geoUsers()
      .where('active', '==', true)
      .near({ center: location, radius: this.state.radius })
      .get();
    snapshot.then(doc => {
      let data = [];
      doc.docs.forEach(item => {
        data.push(item.data());
      });
      this.setState({ users: data });
    });
  };

  onRadiusChange = event => {
    if (!event || !event.target) {
      return;
    }
    this.setState({ radius: +event.target.value });
  };

  render() {
    const { user } = this.props;
    const { location, error, users, radius } = this.state;
    
    return (
      <React.Fragment>
        <h1>
          hello {!!user && !!user.displayName ? user.displayName : 'default'}
        </h1>
        {error && <p>{this.state.error}</p>}
        <label>
          Radius {radius} (km)
          <input
            type="range"
            name="range"
            step="1"
            defaultValue={radius}
            onChange={this.onRadiusChange}
            min="2"
            max="100"
          />
        </label>
        {location && (
          <DanceMap radius={radius} location={location} users={users} />
        )}
        ;
      </React.Fragment>
    );
  }
}

const Home = compose(
  withFirebase,
  withAuthentication,
  withAuthorisation(condition)
)(HomeBase);

export default withGeolocation(HomePage);
