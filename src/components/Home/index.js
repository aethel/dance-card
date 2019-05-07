import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import {
  withAuthorisation,
  withAuthentication,
  AuthUserContext
} from "../Session";
import DanceMap from "../Map";
import withGeolocation from "../Geolocation";
import GeolocationContext from "../Geolocation/context";
import { debounce } from 'throttle-debounce'
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

    this.radiusUpdateDebounced = debounce(3000, this.onRadiusChange);
  }

  async componentDidMount() {
    this.setState({ loading: true });
    const uid = sessionStorage.getItem("uid");
    this.setUsersLocation(uid);
    // this.setUsers();
  }

  componentDidUpdate(prevProps) {
    if (this.props.geolocation.location !== prevProps.geolocation.location) {
      this.setState({ location: this.props.firebase.geoPoint(this.props.geolocation.location.lat, this.props.geolocation.location.lng) })
    }
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log(prevState.radius, this.state.radius);
    if (prevState.radius !== this.state.radius) {
      this.setUsers()
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log(this.state.radius, nextState.radius, this.state.radius !== nextState.radius);
  //   return !!nextState.radius && this.state.radius !== nextState.radius ? true : false
  // }

  setUsersLocation = uid => {
    const geoQuery = this.props.firebase.users().where("d.id", "==", uid);
    geoQuery.get().then(
      res => {
        let location = null;
        res.forEach(function (doc) {
          location = doc.data().d.coordinates;
        });
        this.setState({ location });
        this.setUsers();
      },
      error => this.setState({ error })
    );
  };

  setUsers = () => {
    const snapshot = this.props.firebase.geoUsers().near({ center: this.state.location, radius: this.state.radius }).get();
    snapshot.then(doc => {
      let data = [];
      doc.docs.forEach(item => {
        data.push(item.data());
      });
      this.setState({ users: data });
    });
  };

  onRadiusChange = (event) => {
    if (!event || !event.target) {
      return;
    }
    this.setState({ radius: +event.target.value }, () => {
      this.radiusUpdateDebounced(this.state.radius)
    })
    console.log(this.state.radius);

  }

  render() {
    const { user } = this.props;
    const { location, error, users, radius } = this.state;
    return (
      <React.Fragment>
        <h1>
          hello {!!user && !!user.displayName ? user.displayName : "default"}
        </h1>
        {error && <p>{this.state.error}</p>}
        <label>
          Radius (km)
        <input type="range" name="range" step="1" defaultValue={radius} onChange={this.onRadiusChange} min="2" max="100" />
        </label>
        {location && <DanceMap location={location} users={users} />};
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
