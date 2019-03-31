import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';
import { geolocated } from 'react-geolocated';

const SignUpPage = () => (
  <div>
    <h1>Sign Up</h1>
    <SignUpForm />
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

  onSubmit = event => {
    const { email, password } = this.state;
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        console.log(authUser.user.uid);
        console.log(authUser.user);
        this.props.firebase.users('user').doc(authUser.user.uid);
        // return this.props.firebase.user(authUser.user.uid).set(
        //   {
        //     username,
        //     email
        //   },
        //   { merge: true }
        // );
        return authUser;
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
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { username, email, password, error } = this.state;
    const { isGeolocationAvailable, isGeolocationEnabled, coords } = this.props;
    const isInvalid = password === '' || email === '' || username === '';
    // console.log(coords);
    return (
      <div>
        <div>available {isGeolocationAvailable}</div>
        <div>enabled {isGeolocationEnabled}</div>
        <div>{coords && coords.longitude}</div>
        <div>{coords && coords.latitude}</div>
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

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true
  },
  userDecisionTimeout: 5000
})(SignUpPage);
export { SignUpForm, SignUpLink };
