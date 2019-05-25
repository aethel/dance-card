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
  username: '',
  error: null,
  active: true,
  status: null,
  dances: new Map()
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
    event.preventDefault();
    console.log(this.state, event);
  };

  handleActiveCheckbox = () => {
    this.setState({ active: !this.state.active })
    console.log(this.state);
  }

  handleDanceObjectChange = (e) => {
    console.log(e, e.target, e.target.dataset);
    const dance = e.target.name;
    const isChecked = e.target.checked;
    const position = Object.keys(e.target.dataset)[0];
    // stop overwriting props
    const tempDance = this.state.dances;
    if (tempDance.get(dance)) {
      console.log('exists');
      let danceObj = tempDance.get(dance);
      danceObj = { ...danceObj, ...{ [position]: isChecked } };
      tempDance.set(dance, danceObj);
    } else {
      tempDance.set(dance, { [position]: isChecked })
    }

    this.setState({ dances: tempDance })
    console.log(this.state);
  }


  onChange = event => {
    console.log(this.state.active);
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({ [event.target.name]: value });
    console.log(this.state.active);

  }
  render() {
    const { error, username, active } = this.state;
    const danceListItem = DANCES.map((dance, index) => {
      return (<li key={`${dance}${index}`}>
        <span>{dance}</span>
        <label>
          Lead
          <input type="checkbox" data-lead="lead" defaultChecked name={dance} onChange={this.handleDanceObjectChange} />
        </label>
        <label>
          Follow
          <input type="checkbox" data-follow="follow" defaultChecked name={dance} onChange={this.handleDanceObjectChange} />
        </label>
      </li>)
    })
    return (
      <form onSubmit={this.onSubmit}>
        <fieldset>
          <legend>Personal info</legend>
          <label>
            User name
          <input type="text" name="username" value={username} placeholder="User name" onChange={this.onChange} />
          </label>
          <label>
            Active
          <input type="checkbox" name="active" checked={active} onChange={this.handleActiveCheckbox} />
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
