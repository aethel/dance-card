import React, { useEffect, useState } from 'react';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import {
  ProfileProvider,
  useProfile,
  ProfileConsumer
} from '../Account/ProfileProvider/profile-provider';
import MessagesList from '../Chat/MessagesList';
import { flatMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { collectionData } from 'rxfire/firestore';

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
  console.log(profile);

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
        console.log(mappedResult);
        const groupByFromUser = groupBy('fromUser');
        const groupedMessages = groupByFromUser(mappedResult.flat());
        console.log(Object.entries(groupedMessages));

        setState(Object.entries(groupedMessages));
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
    console.log(state);
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
                <MessagesList messages={message[1]}></MessagesList>
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
