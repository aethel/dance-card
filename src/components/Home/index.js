import React, {Component} from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { withAuthorisation } from '../Session';

const HomePage = () => (
  <div>
    <h1>hello signed in user</h1>
      <Home />
  </div>
);

const condition = authUser => !! authUser;

class HomeBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      users: []
    };
  }

  componentWillMount() {
    this.setState({ loading: true });
    this.props.firebase.users().onSnapshot(
      qs => {
        qs.docs.map(doc => {          
          console.log(doc.data(), 'doc data');
          return true;
        });
      },
      error => console.log(error)
    );
  }
  render() {
    return <div>blah</div>;
  }
}

const Home = compose(withFirebase,withAuthorisation(condition))(HomeBase);

export default HomePage;
