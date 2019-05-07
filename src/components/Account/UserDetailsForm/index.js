import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';

const UserDetailsFormPage = () => (
  <div>
    <h1>User Details</h1>
    <UserDetailstForm />
  </div>
);

const INITIAL_STATE = {
  email: '',
  error: null,
  active: false,
  status: null
};

const DANCES = [
  'lindy hop',
  'blues',
  'fuston',
  'balboa',
  'collegiate shag',
  'salsa',
  'bachata',
  'tango',
  'kizomba',
  'bal folk'
]


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

  handleDanceObjectChange = (e) => {
    console.log(e);
  }

  onChange = event =>
    this.setState({ [event.target.name]: event.target.value });

  render() {
    const { error } = this.state;
    const danceListItem = DANCES.map((dance, index) => {
      return (<li key={`${dance}${index}`}>
        <span>{dance}</span>
        <label>
          Lead
          <input type="checkbox" name={`${dance}Lead`} onChange={this.handleDanceObjectChange(this)} />
        </label>
        <label>
          Follow
          <input type="checkbox" name={`${dance}Follow`} onChange={this.handleDanceObjectChange(this)} />
        </label>
      </li>)
    })
    return (
      <form onSubmit={this.onSubmit}>
        <fieldset>
          <legend>Personal info</legend>
          <label>
            User name
          <input type="text" name="username" placeholder="User name" />
          </label>
          <label>
            Active
          <input type="checkbox" name="active" />
          </label>
        </fieldset>
        <fieldset>
          <legend>Your scene</legend>
          <ul>
            {danceListItem}
          </ul>
        </fieldset>
        <button type="submit">Update</button>
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
