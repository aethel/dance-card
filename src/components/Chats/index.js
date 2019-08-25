import React, { useEffect, useState } from 'react'
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import { ProfileProvider, useProfile, ProfileConsumer } from '../Account/ProfileProvider/profile-provider';
import { flatMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { collectionData } from 'rxfire/firestore';

const ChatsPage = () => (
    <div>
        <AuthUserContext.Consumer>{authUser => authUser && (
            <ProfileProvider>
                <ProfileConsumer>{profile =>
                    <ChatsComponent profile={profile} />}
                </ProfileConsumer>
            </ProfileProvider>
        )}
        </AuthUserContext.Consumer>
    </div>
);

// const groupBy = key => array => array.reduce((objectsByKeyValue, obj) => {
// const value = obj[key];
// objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
// return objectsByKeyValue;
// },{});
// const groupByFromUser = groupBy('fromUser');

const ChatsBase = (props) => {
    const [state, setState] = useState([]);
    const { profile } = useProfile();
    useEffect(() => {
        console.log('loaded first time', profile.id);
        if (profile.id) {
            const fromRef = props.firebase.chats().where('fromID', '==', profile.id);
            const toRef = props.firebase.chats().where('toID', '==', profile.id);
            const fromRef$ = collectionData(fromRef);
            const toRef$ = collectionData(toRef);

            const messages$ = combineLatest(fromRef$, toRef$).pipe(
                flatMap(msgs => {
                    const [incoming, sent] = msgs;
                    return [...incoming, ...sent]
                })
            )
            messages$.subscribe((item) => {
                const messages = [...state, item];
                setState(messages)
            })
        }
    }, [profile.id])

    return (
        <div>
            chat page, with a list of chats - date of last message and from what user. click to go to list of messages
      {state.length > 0 && state.sort((item1, item2) => item1.timestamp > item2.timestamp).map((message,index) => 
          {            
           return (<div key={index}>
               {message.fromUser},{message.message}, {new Date(message.timestamp).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>)
            })
        } 
        </div>
    )
}

const ChatsComponent = withFirebase(ChatsBase);
export default ChatsPage; 