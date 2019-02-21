import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import * as ROUTES from '../../constants/routes';

const SignInPage = () => (
    <div>
        <h1>sign blahhh in</h1>
        <SignInForm />
        <SignUpLink />
    </div>
);

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null
}
class SignInFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE }
    }

    onSubmit = event => {
        debugger;
        const { email, password } = this.state;
        this.props.firebase.doSignInWithEmailAndPassword(email, password).then(res => {
            this.setState({ ...INITIAL_STATE });
            this.props.history.push(ROUTES.HOME);
        }).catch(error => this.setState({ error }))
    }
    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    render() {
        const { email, password, error } = this.state;
        const isInvalid = password === '' || email === '';
        return (
            <form action="">
                <label htmlFor="">
                    email
            <input type="text" value={email} name='email' onChange={this.onChange} />

                </label>
                <label htmlFor="">
                    password
                <input type="text" value={password} name='password' onChange={this.onChange} />
                </label>
                <button disabled={isInvalid} onClick={this.onSubmit}>login</button>
                {error && <p>{error.message}</p>}
            </form>
        )
    }
}

const SignInForm = compose(withFirebase, withRouter)(SignInFormBase);

export default SignInPage;
export { SignInForm };