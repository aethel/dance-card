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
    this.props.firebase.users().onSnapshot(
      qs => {
        console.log(qs);
        console.log(qs.docs);

        qs.docs.map(doc => {          
          console.log(doc, 'doc');
          console.log(doc.data(), 'doc');
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

const Home = compose(withFirebase)(HomeBase);

export default HomePage;
