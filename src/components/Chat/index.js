import React, { PureComponent, Fragment } from 'react'
import { withFirebase } from '../Firebase';
import MessagesList from './MessagesList';

const INITIAL_STATE = {
    message: '',
    fromID: null,
    toID: null,
    fromUser: null,
    timestamp: null,
    messages: []
}



class ChatBase extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE }
    }
    messagesOrConfig = (item) => {
        if (item.hasOwnProperty('messages') && Object.prototype.toString.call(item.messages) === '[object Array]') {
            this.setState({ messages: item.messages })
        }
        if (!item.hasOwnProperty('messages') && Object.prototype.toString.call(item) === '[object Object]') {
            this.setState({ fromID: item.id })
            this.setState({ toID: item.id })
            this.setState({ fromUser: item.username })
        }
    }
    componentDidMount() {
        this.messagesOrConfig(this.props.location.state);
    }
    //method to check if incoming array ? then messages. if object, then message config obj.return appropriate val
    onSubmit = async (event) => {
        const { message, fromUser, fromID, toID, timestamp } = this.state;
        event.preventDefault();
        await this.addChatIdToUsers();
        const chatsRef = this.props.firebase.chats();
        chatsRef.doc().set({ message, fromID, toID, timestamp, fromUser, chatID: `${fromID}${toID}` }).then(docRef => {
            console.log(docRef);
            // use chat(id) to set new Obj
        })
            .catch(function (error) {
                console.error('Error adding document: ', error);
            });
    }

    onChange = event => {
        const { fromID, toID, fromUser } = this.state;
        this.setState({ [event.target.name]: event.target.value, fromUser, fromID, toID, timestamp: Date.now() });
    };

    findDocID = ({ docs }) => docs[0].id;

    userChatsObjUpdate = async (userID) => {
        const { fromID, toID } = this.state;
        const userIDobject = await this.props.firebase.geoUsers().where('id', '==', userID).get();
        const userIDdocID = this.findDocID(userIDobject);
        const userIDref = this.props.firebase.geoUsers().doc(userIDdocID);
        const userObj = await userIDref.get();
        const userChats = userObj.data().chats || [];
        const chatIdExists = userChats.includes(`${fromID}${toID}`);
        !chatIdExists && userChats.push(`${fromID}${toID}`);
        await userIDref.set({ chats: userChats }, { merge: true })
    }

    addChatIdToUsers = () => {
        const { fromID, toID } = this.state;
        this.userChatsObjUpdate(fromID);
        this.userChatsObjUpdate(toID);
    }

    render() {
        console.log(this.state);

        const { message, messages, fromID, toID } = this.state;
        return (
            <Fragment>
                {/* <MessagesList fromID={fromID} toID={toID} /> */}
                <p>chat page</p>
                {messages && <MessagesList fromID={fromID} toID={toID} messages={messages} />}
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