import React from 'react';
// import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Router } from '@reach/router';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import { ChatPage } from '../Chat';

const App = () => {  
 return (
   <div>
            <Navigation />
            <hr />
          <Router>


            {/* <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route
              exact
              path={ROUTES.PASSWORD_FORGET}
              component={PasswordForgetPage}
            />
            <Route exact path={ROUTES.HOME} component={HomePage} />
            <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route exact path={ROUTES.ADMIN} component={AdminPage} />
            <Route exact path={ROUTES.CHAT} component={ChatPage} /> */}
            <LandingPage path={ROUTES.LANDING}/>
       <SignUpPage path={ROUTES.SIGN_UP}/>
       <SignInPage path={ROUTES.SIGN_IN}/>
       <PasswordForgetPage path={ROUTES.PASSWORD_FORGET}/>
       <HomePage path={ROUTES.HOME}/>
       <AccountPage path={ROUTES.ACCOUNT}/>
       <AdminPage path={ROUTES.ADMIN}/>
       <ChatPage path='chat/:to/:from'/>
        </Router>
          </div>
)}

export default withAuthentication(App);
