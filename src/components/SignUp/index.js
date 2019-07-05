import React, { Component } from "react";
import { Link, navigate } from "@reach/router";
import { compose } from "recompose";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../Firebase";
import withGeolocation from "../Geolocation";
import GeolocationContext from "../Geolocation/context";
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
  username: "",
  email: "",
  password: "",
  error: null,
  active: true
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE }; //used with destructuring, so that initial state can be reused later to reset the values
  }

  // componentDidMount(){
  //   this.getGeolocation();
  // }

  componentDidMount() {
    this.showGeolocationDenialError();
    console.log(this.props, 'mount');
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.geoLocation.location !== prevProps.geoLocation.location && this.props.geoLocation.location){
      this.showGeolocationDenialError(false);
    }    
  }

  showGeolocationDenialError = (showError = true) => {
    if(showError) {
      this.setState({ error: 'Please allow the use of geolocation. It is crucial to proper functioning of the app. If you denied it before, it may have to be renabled in your browser\'s settings.' })
    } else { 
      this.setState({ error: null })
    }
  }

  onSubmit = event => {
    const { email, password, username, active } = this.state;
    const { geoLocation:{geoPoint} } = this.props;

    if(!geoPoint) {
      this.setState({error: 'Geolocation has not been allowed'});
      return false;
    }

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        const doc = {
          username,
          email,
          coordinates: geoPoint,
          id: authUser.user.uid,
          active
        };
        return this.props.firebase
          .geoUsers()
          .add(doc)
          .then(docRef => {
          }, error => {
            this.setState({ error })
          });
      })
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        // this.props.history.push(ROUTES.HOME);
        navigate(ROUTES.HOME)
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
    const isInvalid = password === "" || email === "" || username === "";
    return (
      <div>
        {/* {error && <p>{error}</p>} */}
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
  // withRouter,
  withFirebase
)(SignUpFormBase);

export default withGeolocation(SignUpPage);
export { SignUpForm, SignUpLink };
