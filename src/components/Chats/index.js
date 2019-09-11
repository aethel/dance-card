import React, { useEffect, useState } from 'react';
import { Link } from '@reach/router';
import * as ROUTES from "../../constants/routes";
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import {
  ProfileProvider,
  useProfile,
  ProfileConsumer
} from '../Account/ProfileProvider/profile-provider';

const ChatsPage = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser && (
          <ProfileProvider>
            <ProfileConsumer>
              {profile => <ChatsComponent profile={profile} />}
            </ProfileConsumer>
          </ProfileProvider>
        )
      }
    </AuthUserContext.Consumer>
  </div>
);

const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, []);

const ChatsBase = props => {
  const [state, setState] = useState([]);
  const { profile } = useProfile();

  useEffect(() => {
    console.log('loaded first time', profile.id);
    if (profile.id) {
      const chatIDs = [];
      profile.chats.forEach(chatID =>
        chatIDs.push(
          props.firebase
            .chats()
            .where('chatID', '==', chatID)
            .get()
        )
      );
      Promise.all(chatIDs).then(results => {
        const mappedResult = results.map(result =>
          result.docs.map(doc => doc.data())
        );
        const groupByFromUser = groupBy('fromUser');
        const groupedMessages = groupByFromUser(mappedResult.flat());

        setState(Object.entries(groupedMessages));
        console.log(state);
        
      });
    }

    // const messages$ = combineLatest(fromRef$, toRef$).pipe(
    //     flatMap(msgs => {
    //         const [incoming, sent] = msgs;
    //         return [...incoming, ...sent]
    //     })
    // )
    // messages$.subscribe((item) => {
    //     const messages = [...state, item];
    //     setState(messages)
    // })
  }, [profile.id]);

  return (
    <div>
      chat page, with a list of chats - date of last message and from what user.
      click to go to list of messages
      {state.length > 0 &&
        state
          // .sort((item1, item2) => item1.timestamp > item2.timestamp)
          .map((message, index) => {
            return (
              <div key={index}>
                {message[0]}
                {console.log(message[1])}
                <Link to={ROUTES.CHAT} state={{messages:message[1]}}>Message User Link</Link>
                {/* {new Date(message.timestamp).toLocaleDateString('en-GB', {
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })} */}
              </div>
            );
          })}
    </div>
  );
};

const ChatsComponent = withFirebase(ChatsBase);
export default ChatsPage;
