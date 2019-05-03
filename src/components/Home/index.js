import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import {
  withAuthorisation,
  withAuthentication,
  AuthUserContext
} from "../Session";
import DanceMap from "../Map";

const HomePage = () => (
  <section>
    <AuthUserContext.Consumer>
      {authUser => <Home user={authUser} />}
    </AuthUserContext.Consumer>
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
    // this.getUsers();
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
        this.getUsers();
      },
      error => this.setState({ error })
    );
  };

  getUsers = () => {
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

export default HomePage;
