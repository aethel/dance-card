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
    this.setUsersLocation('0NLgjaNzmWckJ4TiITL1GxTKhb82')
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

  setUsersLocation = (uid) => {
    this.props.firebase.user(uid).get().then(res => {      
      this.setState({location: res.data().location})
    });    
  };

  render() {
    const {user} = this.props;
    const {location} = this.state;
    
    return <React.Fragment>
      <h1>hello {user ? user.displayName : 'default'}</h1>
  {location && <DanceMap location={location}/>};
     
    </React.Fragment>
  }
}

const Home = compose(withFirebase, withAuthentication, withAuthorisation(condition))(HomeBase);

export default HomePage;
