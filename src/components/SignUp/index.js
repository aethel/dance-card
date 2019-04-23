import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';
import withGeolocation from '../Geolocation';
import GeolocationContext from '../Geolocation/context';
// import { geolocated } from 'react-geolocated';

const SignUpPage = () => (
  <div>
    <h1>Sign Up</h1>
    <GeolocationContext.Consumer>
      {location => <SignUpForm geoLocation={location} />}
    </GeolocationContext.Consumer>
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  password: '',
  error: null
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE }; //used with destructuring, so that initial state can be reused later to reset the values
  }

  // componentDidMount(){
  //   this.getGeolocation();
  // }

  onSubmit = event => {
    const { email, password, username } = this.state;
    const { geoLocation } = this.props;
    // geo.point(latitude: pos['latitude'], longitude: pos['longitude']);
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return this.props.firebase
          .users()
          .doc(authUser.user.uid)
          .set(
            { username, email, location: geoLocation.geoPoint },
            { merge: true }
          );
      })
      .then(authUser => {
        console.log(authUser);
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  onChange = event => {
    console.log(this.state);
    console.log(this.props, 'sign up');
    this.setState({ [event.target.name]: event.target.value });
  };

  // getGeolocation = () => {
  //   if(navigator.geolocation){
  //     navigator.geolocation.getCurrentPosition((position) => {
  //        const location = this.props.firebase.geoPoint(position.coords.latitude,position.coords.longitude)
  //       this.setState({location});
  //     })
  //   } else {
  //     this.setState({error: 'Geolocation unavailable'})
  //     console.warn('no geolocation');
  //   }
  // }
  render() {
    const { username, email, password, error } = this.state;
    const isInvalid = password === '' || email === '' || username === '';
    // console.log(coords);
    return (
      <div>
        <form>
          <input
            type="text"
            name="username"
            value={username}
            onChange={this.onChange}
            placeholder="name"
          />
          <input
            type="email"
            name="email"
            value={email}
            onChange={this.onChange}
            placeholder="email"
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={this.onChange}
            placeholder="password"
          />
          <button disabled={isInvalid} type="button" onClick={this.onSubmit}>
            Submit
          </button>
          {error && <p>{error.message}</p>}
        </form>
      </div>
    );
  }
}

const SignUpLink = () => (
  <p>
    no account? <Link to={ROUTES.SIGN_UP}>SIGN UP</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase
)(SignUpFormBase);

export default withGeolocation(SignUpPage);
export { SignUpForm, SignUpLink };
