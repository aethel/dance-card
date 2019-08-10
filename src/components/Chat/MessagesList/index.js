import React, { useState, useEffect } from 'react'
import { withFirebase } from '../../Firebase';
import {map, flatMap} from 'rxjs/operators';
import {combineLatest} from 'rxjs';
import {collection} from 'rxfire/firestore';

const MessageListBase = (props) => {
    const [messages, setMessages] = useState([]);
    const { toID, fromID } = props;
    const uid = sessionStorage.getItem('uid');
    // console.log(props);

    useEffect(() => {
    //     return props.firebase.chats().where('toID', '==', uid).where('fromID', '==', uid).onSnapshot(querySnapshot => {
    //   setMessages(querySnapshot.docs.map(message=> message.data()));
    //     })
        combineMessages();
    }, []);


    const combineMessages = async () => {
        const fromRef = props.firebase.chats().where('fromID', '==', uid);
        const toRef = props.firebase.chats().where('toID', '==', uid);
        const fromRef$ = collection(fromRef);
        const toRef$ = collection(toRef);

        const messages$ = combineLatest(fromRef$,toRef$).pipe(
            flatMap(msgs => {
                const [incoming, sent] = msgs;
                console.log(messages);
                return [...incoming,...sent]
            }),
            map(docs => docs.data())
        )

    //     messages$.subscribe(item => 
    //         {debugger
    //         console.log(item.data())})
    //     console.log(messages);
        
    // }


        // collection(db.collection('users'))
        //     .pipe(map(docs => docs.map(d => d.data())))
        //     .subscribe(users => { console.log(users) });

        messages$.subscribe(item => {
            setMessages([...messages,item]);
            console.log(messages);
            console.log(item);
        })
        
        
        }
    return (
        
        <ul>
            
        </ul>
    )
}

// on init check if user id is in some collections
//if so, donwload
// list to updated in messages in this collection
//on unmount kill subscription ? 

const MessagesList = withFirebase(MessageListBase);
export default MessagesList;