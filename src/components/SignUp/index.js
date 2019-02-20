import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { FirebaseContext } from '../Firebase';

const SignUpPage = () => (
    <div>
        <h1>Sign Up</h1>
        <FirebaseContext.Consumer>
            {firebase => <SignUpForm firebase={firebase} />}
        </FirebaseContext.Consumer>
    </div>
)

const INITIAL_STATE = {
    username: '',
    email: '',
    password: '',
    error: null
}

class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE } //used with destructuring, so that initial state can be reused later to reset the values
    }

    onSubmit = event => {
        const { username, email, password } = this.state;
        this.props.firebase.doCreateUserWithEmailAndPassword(email, password).then(authUser => {
            this.setState({ ...INITIAL_STATE });
        }).catch(error => {
            this.setState({ error });
        })
    }

    onChange = event => { this.setState({ [event.target.name]: event.target.value }) }

    render() {
        const { username, email, password, error } = this.state;
        const isInvalid = password === '' || email === '' || username === '';

        return (
            <form>
                <input type="text" name='username' value={username} onChange={this.onChange} placeholder='name' />
                <input type="email" name='email' value={email} onChange={this.onChange} placeholder='email' />
                <input type="password" name='password' value={password} onChange={this.onChange} placeholder='password' />
                <button disabled={isInvalid} type='button' onClick={this.onSubmit} >Submit</button>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignUpLink = () => (
    <p>no account? <Link to={ROUTES.SIGN_UP}>SIGN UP</Link></p>
)

export default SignUpPage;
export { SignUpForm, SignUpLink };
