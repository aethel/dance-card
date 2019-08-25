import React from 'react'
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import { ProfileProvider, useProfile, ProfileConsumer } from '../Account/ProfileProvider/profile-provider';


const ChatsPage = () => (
    <div>
        <AuthUserContext.Consumer>{authUser => authUser && (
            <ProfileProvider>
                <ProfileConsumer>{profile => <ChatsComponent profile={profile} />}
                </ProfileConsumer>
            </ProfileProvider>
        )}
        </AuthUserContext.Consumer>

    </div>
);

const ChatsBase = (props) => {
    console.log('chats');
    
    return (
        <div>chat page</div>
    )
}

const ChatsComponent = withFirebase(ChatsBase);
export default ChatsPage; 