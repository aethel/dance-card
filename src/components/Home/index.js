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
    this.setUsersLocation(uid);
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

  setUsersLocation = uid => {
    // // const geoQuery = this.props.firebase.users().where('d.id', '==', uid);
    // const geoQuery = this.props.firebase.users();
    // console.log(uid, 'home');
    // geoQuery.get().then(
    //   res => {
    //     let location = null;
    //     // res.forEach(function(doc) {
    //     //   console.log(doc.data(), 'home');
    //     //   location = doc.data().d.coordinates;
    //     // });
    //     res.forEach(function(doc) {
    //       console.log(doc.data().id === uid, doc.data().id, uid);
    //       if (doc.data().id === uid) {
    //         location = doc.data().d.coordinates;
    //       }
    //     });
    //     this.setState({ location });
    //     this.setUsers();
    //   },
    //   error => this.setState({ error })
    // );
  };

  setUsers = location => {
    // const { location } = this.state;
    if (!location) {
      return false;
    }
    const snapshot = this.props.firebase
      .geoUsers()
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
