import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';

const UserDetailsFormPage = () => (
  <div>
    <h1>'User Details'</h1>
    <UserDetailstForm />
  </div>
);
/*
active
status
dances
  dance 1
    lead
    follow
  dance 2
    lead
    follow
  dance 3
    lead
    follow

*/
const INITIAL_STATE = {
  email: '',
  error: null,
  active: false,
  status: null,
  dances: []
};

class UserDetailstFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;
    this.props.firebase
      .doPasswordReset(email)
      .then(() => this.setState({ ...INITIAL_STATE }))
      .catch(error => this.setState({ error }));
  };

  onChange = event =>
    this.setState({ [event.target.name]: event.target.value });

  render() {
    const { email, error } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <input
          type="email"
          value={email}
          onChange={this.onChange}
          placeholder="Email"
        />
        <button type="submit">Reset</button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

const UserDetailstForm = withFirebase(UserDetailstFormBase);

export default UserDetailsFormPage;

export { UserDetailstForm, PasswordForgetLink };
