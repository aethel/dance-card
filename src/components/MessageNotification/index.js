import React, { useState } from 'react';
import * as ROUTES from '../../constants/routes';

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';

const MessageNotificationBar = () => (
    <div>
        <AuthUserContext.Consumer>
            {authUser =>
                (authUser && <MessageNotification user={authUser} />)
            }
        </AuthUserContext.Consumer>
    </div>
);

const MessageNotificationBase = (props) => {
    const [chatIDs, setChatIDs] = useState(null);
    const uid = sessionStorage.getItem('uid');
    const geoQuery = props.firebase.geoUsers().where('id', '==', uid);
    geoQuery.get().then(res => {
        res.docs.forEach(doc => {
            console.log(doc);
            console.log(doc.data().chats);
            setChatIDs(doc.data().chats)
        })
    });

if(chatIDs){
    chatIDs.forEach(chat => {
        props.firebase.chats().where('id','==',chat).onSnapshot( snapshot => {
            snapshot.forEach( item => {
                console.log(item);
                
            })      
        })
    })
}
    // const chats = async () => {
    //     const snapshot = await props.firebase.chats().get();
    //     const mappedMessages = snapshot.docs.map(doc => {
    //       // console.log(doc('id from user').collection('messages'));

    //       return doc.data()});

    //     console.log(mappedMessages);

    // }
    // chats();

    return (
        <div>
            is notification
   </div>

    )
};

const MessageNotification = withFirebase(MessageNotificationBase)
export default MessageNotificationBar;
