import React, { useState, useEffect } from 'react'
import { withFirebase } from '../../Firebase';

const MessageListBase = (props) => {
    const [messages, appendMessage] = useState([]);

    useEffect(() => {
        const chats = async () => {
            const snapshot = await props.firebase.chats().get();
            console.log(snapshot.docs.map(doc => doc.data()));
            snapshot.docs.forEach(item => {
                console.log(item.data());
                
            })
            return snapshot.docs.map(doc => doc.data());
        }
        chats();

    }, []);

    return (
        <ul>
            <li>is a chat list</li>
        </ul>
    )
}

// on init check if user id is in some collections
//if so, donwload
// list to updated in messages in this collection
//on unmount kill subscription ? 

const MessagesList = withFirebase(MessageListBase);
export default MessagesList;