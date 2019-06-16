import React from 'react';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import { withAuthorisation, AuthUserContext } from '../Session';
import UserDetailstForm from './UserDetailsForm';
const Account = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        account
        <PasswordForgetForm />
        <PasswordChangeForm />
        <UserDetailstForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);
const condition = authUser => !!authUser;
export default withAuthorisation(condition)(Account);
