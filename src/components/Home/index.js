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
      location: null
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    const uid = sessionStorage.getItem("uid");
    this.setUsersLocation(uid);
    // this.setUsers();
  }

  componentDidUpdate(prevProps) {
    if (this.props.geolocation.location !== prevProps.geolocation.location) {
      this.setState({ location: this.props.geolocation.location })
      console.log(this.state, 'didupdate');
    }
  }

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
    const snapshot = this.props.firebase.geoUsers().near({ center: this.state.location, radius: 100 }).get();
    snapshot.then(doc => {
      let data = [];
      doc.docs.forEach(item => {
        data.push(item.data());
      });
      this.setState({ users: data });
    });
  };

  render() {
    const { user } = this.props;
    const { location, error, users } = this.state;
    // console.log(geolocation);
    return (
      <React.Fragment>
        <h1>
          hello {!!user && !!user.displayName ? user.displayName : "default"}
        </h1>
        {error && <p>{this.state.error}</p>}
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
