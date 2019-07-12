import React, { useState, useEffect } from 'react'
import { withFirebase } from '../../Firebase';

const MessageListBase = (props) => {
    const [messages, setMessages] = useState([]);
    const { toID, fromID } = props;
    // console.log(props);

    useEffect(() => {
        // const chats = async () => {
        //     const snapshot = await props.firebase.chats().doc(`${props.fromID}${props.toID}`).collection('messages').get();
        //     const mappedMessages = snapshot.docs.map(doc => doc.data());
        //     setMessages(mappedMessages)
        // }
        // chats();
        listenForUpdates();

    }, []);

    const listenForUpdates = () => {
        props.firebase.chats().doc(`${props.fromID}${props.toID}`).collection('messages').onSnapshot(
            doc => {
                const mappedMessages = doc.docs.map(doc => doc.data()).sort((a, b) => a.timestamp > b.timestamp)
                setMessages(mappedMessages)
            }
        )
    }

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