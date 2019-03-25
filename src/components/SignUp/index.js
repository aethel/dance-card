import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';

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
    const { email, password, username } = this.state;
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return this.props.firebase
          .user(authUser.user.id)
          .set({ username, email });
      })
      .then(authUser => {
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
    const isInvalid = password === '' || email === '' || username === '';

    return (
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

export default SignUpPage;
export { SignUpForm, SignUpLink };
