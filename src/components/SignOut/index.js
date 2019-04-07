import React from 'react';
import { withParse } from '../Parse';

const SignOutButton = ({ firebase }) => (
  <button type="button" onClick={firebase.doSignOut}>
    sign out
  </button>
);

export default withParse(SignOutButton);
