import React, { useState, useEffect } from 'react'
import { withFirebase } from '../../Firebase';

const MessageListBase = (props) => {
    const [messages, setMessages] = useState([]);
    const { toID, fromID } = props;
    const uid = sessionStorage.getItem('uid');
    // console.log(props);

    useEffect(() => {
  return props.firebase.chats().where('fromID', '==', uid).onSnapshot(querySnapshot => {
      setMessages(querySnapshot.docs.map(message=> message.data()));
        })

    }, []);

    return (
        <ul>
            {messages.map((item, index) => (
                <li key={`${item.message}${index}`}>{item.message} {new Date(item.timestamp).toLocaleDateString('en-GB',{ month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</li>
            ))}
        </ul>
    )
}

// on init check if user id is in some collections
//if so, donwload
// list to updated in messages in this collection
//on unmount kill subscription ? 

const MessagesList = withFirebase(MessageListBase);
export default MessagesList;