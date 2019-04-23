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
   
  componentDidMount() {
    this.setState({ loading: true });
    const uid = sessionStorage.getItem('uid');
    console.log(uid);
    this.setUsersLocation(uid);    
  }

  setUsersLocation = (uid) => {
    this.props.firebase.user(uid).get().then(res => {      
      this.setState({location: res.data().location})
    }, error => this.setState({error}));    
  };

  render() {
    const {user} = this.props;
    const {location, error} = this.state;
    
    return <React.Fragment>
      <h1>hello {user ? user.username : 'default'}</h1>
{error && <p>{this.state.error}</p>}
  {location && <DanceMap location={location}/>};
     
    </React.Fragment>
  }
}

const Home = compose(withFirebase, withAuthentication, withAuthorisation(condition))(HomeBase);

export default HomePage;
