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
    const geoQuery = this.props.firebase.geoUsers();
    geoQuery.get().then(

      res => {

        let username = null;
        let docID = null;
        let dances = null;

        res.forEach(function (doc) {
          if (doc.data().id === uid) {
            docID = doc.id;
            username = doc.data().username;
            dances = doc.data().dances && objToStrMap(doc.data().dances);
          }
        });
        // console.log(this.state.dances);
        // console.log(dances);
        // console.log(new Map([...this.state.dances, ...dances]));
        if (username) {
          this.setState({ username })
        }
        if (docID) {
          this.setState({ docID })
        }
        if (dances) {
          this.setState({ dances: new Map([...dances]) })
          console.log(this.state.dances);

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
    console.log(docRef);

    docRef.set(doc, { merge: true }).then(updateResult => console.log(updateResult));

    console.log(this.state, doc);
  };



  handleActiveCheckbox = () => {
    this.setState({ active: !this.state.active })
    console.log(this.state);
  }

  handleDanceObjectChange = (e) => {
    console.log(this.props);

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
    console.log(this.state);
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
          <input type="checkbox" data-lead="lead" defaultChecked={dancePosition.lead} name={danceName} onChange={this.handleDanceObjectChange} />
        </label>
        <label>
          Follow
          <input type="checkbox" data-follow="follow" defaultChecked={dancePosition.follow} name={danceName} onChange={this.handleDanceObjectChange} />
        </label>
      </li>)
    })
    return (
      <form onSubmit={this.onSubmit}>
        {this.state.username} username
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

const UserDetailstForm = compose(withFirebase, withAuthentication)(UserDetailstFormBase);

export default UserDetailsFormPage;

