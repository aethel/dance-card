import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { withFirebase } from '../../Firebase';
// import * as ROUTES from '../../../constants/routes';
import { compose } from "recompose";
import { withAuthentication, AuthUserContext } from '../../Session';
import dances from './dances-map';

const UserDetailsFormPage = (user) => (
  <div>
    <h1>User Details</h1>
    <AuthUserContext.Consumer>
      {authUser => <UserDetailstForm user={authUser} />}
    </AuthUserContext.Consumer>
  </div>
);

const INITIAL_STATE = {
  email: '',
  username: 'test',
  error: null,
  active: true,
  status: null,
  dances: dances,
  docID: null
};


const strMapToObj = (strMap) => {
  let obj = Object.create(null);
  for (let [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

const objToStrMap = (obj) => {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

class UserDetailstFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    const { user: { uid } } = this.props;
    const { username, active, dances } = this.state;
    console.log(this.state);

    const geoQuery = this.props.firebase.geoUsers().where('id', '==', uid);
    geoQuery.get().then(
      res => {
        let usernameQuery = username;
        let docID = null;
        let dancesQuery = dances;
        let isActive = active;

        res.docs.forEach(function (doc) {
          docID = doc.id;
          usernameQuery = doc.data().username;
          isActive = doc.data().active;
          dancesQuery = doc.data().dances && objToStrMap(doc.data().dances);
        });
        if (usernameQuery) {
          this.setState({ username: usernameQuery })
        }
        if (docID) {
          this.setState({ docID })
        }
        if (isActive !== undefined || isActive !== null) {
          this.setState({ active: isActive })
        }
        if (dancesQuery) {
          this.setState({ dances: new Map([...dancesQuery]) })
        }
      },
      error => this.setState({ error })
    );

  }


  onSubmit = event => {
    event.preventDefault();
    const doc = {
      username: this.state.username,
      email: this.state.email,
      dances: strMapToObj(this.state.dances),
      active: this.state.active
    };
    const { docID } = this.state;
    const docRef = this.props.firebase.geoUsers().doc(docID);
    docRef.set(doc, { merge: true }).then(updateResult => console.log(updateResult));
  };

  handleActiveCheckbox = () => {
    this.setState({ active: !this.state.active })
  }

  handleDanceObjectChange = (e) => {
    const dance = e.target.name;
    const isChecked = e.target.checked;
    const position = Object.keys(e.target.dataset)[0];
    const tempDance = this.state.dances;
    if (tempDance.get(dance)) {
      let danceObj = tempDance.get(dance);
      danceObj = { ...danceObj, ...{ [position]: isChecked } };
      tempDance.set(dance, danceObj);
    } else {
      tempDance.set(dance, { [position]: isChecked })
    }

    this.setState({ dances: tempDance })
  }


  onChange = event => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({ [event.target.name]: value });
  }

  render() {
    const { error, username, active, dances } = this.state;
    const danceListItem = Array.from(dances).map((dance, index) => {
      const danceName = dance[0];
      const dancePosition = dance[1];
      return (<li key={`${danceName}${index}`}>
        <span>{danceName}</span>
        <label>
          Lead
          <input type="checkbox" data-lead="lead" checked={dancePosition.lead} name={danceName} onChange={this.handleDanceObjectChange} />
        </label>
        <label>
          Follow
          <input type="checkbox" data-follow="follow" checked={dancePosition.follow} name={danceName} onChange={this.handleDanceObjectChange} />
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
          <input type="checkbox" name="active" checked={!!active} onChange={this.handleActiveCheckbox} />
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

const UserDetailstForm = compose(withFirebase, withAuthentication)(UserDetailstFormBase);

export default UserDetailsFormPage;

