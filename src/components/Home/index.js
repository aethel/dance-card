import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { withAuthorisation, withAuthentication, AuthUserContext } from '../Session';
import DanceMap from '../Map';

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
    const uid = sessionStorage.getItem('uid');    
    this.setUsersLocation(uid);    
    this.setGeoUsersLocation();
    const snapshot = await this.props.firebase.users().get();
    const data = [];
    snapshot.docs.map(doc => data.push(doc.data()));
    this.setState({users:[...this.state.users,...data]})
  }

setGeoUsersLocation = () => {
const query = this.props.firebase.geoUsers().near({center: new this.props.firebase.firestoreRef.GeoPoint(52.520008,13.404954), radius: 100});
query.get().then(res => console.log(res.docs, 'geo query'));
}
  setUsersLocation = (uid) => {
    this.props.firebase.user(uid).get().then(res => {      
      this.setState({location: res.data().location})
    }, error => this.setState({error}));    
  };

  render() {
    const {user} = this.props;
    const {location, error, users} = this.state;
    
    return <React.Fragment>
      <h1>hello {!!user && !!user.displayName ? user.displayName : 'default'}</h1>
{error && <p>{this.state.error}</p>}
  {location && <DanceMap location={location} users={users}/>};
     
    </React.Fragment>
  }
}

const Home = compose(withFirebase, withAuthentication, withAuthorisation(condition))(HomeBase);

export default HomePage;
