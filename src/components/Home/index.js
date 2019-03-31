import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';

const HomePage = () => (
  <div>
    <Home />
  </div>
);

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
    this.props.firebase.users('user').onSnapshot(qs => {
      qs.docs.map(doc => console.log(doc));
    });
  }
  render() {
    return <div>blah</div>;
  }
}

const Home = compose(withFirebase)(HomeBase);

export default HomePage;
