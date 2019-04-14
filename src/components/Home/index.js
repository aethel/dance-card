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
    console.log('mounted');
    
    // this.props.firebase.users().onSnapshot(
    //   qs => {
    //     qs.docs.map(doc => {          
    //       console.log(doc.data(), 'doc data');
    //       return true;
    //     });
    //   },
    //   error => console.log(error)
    // );
  }

  getUsersLocation = (uid) => {
    this.props.firebase.user(uid).get().then(res => {
      console.log(res.data());
      this.setState({location: res.data().location})
    });
    //get user from firebase and return thei location
  };

  render() {
    console.log(this.props.firebase.auth.currentUser.uid, 'curentUser');
    const {user} = this.props;
    const {location} = this.state;
    {user ? this.getUsersLocation('0NLgjaNzmWckJ4TiITL1GxTKhb82') : console.log('bouser')};
    
    return <React.Fragment>
      <h1>hello {user ? user.displayName : 'default'}</h1>
      <DanceMap location={location}/>;
     
    </React.Fragment>
  }
}

const Home = compose(withFirebase, withAuthentication, withAuthorisation(condition))(HomeBase);

export default HomePage;
