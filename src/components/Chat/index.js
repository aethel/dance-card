import React, { PureComponent, Fragment } from 'react'
import { withFirebase } from '../Firebase';
import MessagesList from './MessagesList';

const INITIAL_STATE = {
    message: '',
    fromID: null,
    toID: null,
    fromUser: null,
    timestamp: null
}

class ChatBase extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE }
    }

    onSubmit = (event) => {
        const { fromID, toID, fromUser } = this.props;
        console.log(fromUser);
        
        const { message, timestamp } = this.state;
        event.preventDefault();
        this.addChatIdToUsers();
        console.log(fromID, toID, message);
        const chatsRef = this.props.firebase.chats();
        chatsRef.doc().set({ message, fromID, toID, timestamp, fromUser, chatID: `${fromID}${toID}`}).then(docRef => {
            console.log(docRef);
            // use chat(id) to set new Obj
        })
            .catch(function (error) {
                console.error('Error adding document: ', error);
            });
    }

    onChange = event => {
        const { fromID, toID, fromUser } = this.props;
        this.setState({ [event.target.name]: event.target.value, fromUser, fromID, toID, timestamp: Date.now() });
    };

    findDocID = ({ docs }) => docs[0].id;

    userChatsObjUpdate = async (userID) => {
        const { fromID, toID } = this.props;
        const userIDobject = await this.props.firebase.geoUsers().where('id', '==', userID).get();
        const userIDdocID = this.findDocID(userIDobject);
        const userIDref = this.props.firebase.geoUsers().doc(userIDdocID);
        if (userIDref && userIDref.hasOwnProperty('docs')){
            const userChats = userIDref.docs[0].data().chats;
            userChats.push(`${fromID}${toID}`);
            userIDref.set({ chats: userChats }, { merge: true })
        }
    }

    addChatIdToUsers = async () => {
        const { fromID, toID } = this.props;
        this.userChatsObjUpdate(fromID);
        this.userChatsObjUpdate(toID);
    }

    render() {
        const { message } = this.state;
        const { fromID, toID } = this.props;
        return (
            <Fragment>
                <MessagesList fromID={fromID} toID={toID} />
                <form onSubmit={this.onSubmit}>
                    <input name="message" type="text" defaultValue={message} placeholder="Your message" onChange={this.onChange} />
                    <button type="submit">Send</button>
                </form>
            </Fragment>
        )

    }
}

const ChatPage = withFirebase(ChatBase);
export default ChatPage;