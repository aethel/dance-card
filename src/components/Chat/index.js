import React, { PureComponent, Fragment } from 'react'
import { withFirebase } from '../Firebase';
import MessagesList from './MessagesList';

const INITIAL_STATE = {
    message: '',
    fromID: null,
    toID: null,
    timestamp: null
}

class ChatBase extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE }
    }

    componentDidMount() {
        // db.collection("cities").where("state", "==", "CA")
        //     .onSnapshot(function (querySnapshot) {
        //         var cities = [];
        //         querySnapshot.forEach(function (doc) {
        //             cities.push(doc.data().name);
        //         });
        //         console.log("Current cities in CA: ", cities.join(", "));
        //     });
        const { fromID, toID } = this.props;
        this.props.firebase.chats().doc(`${fromID}${toID}`).collection('messages').onSnapshot(querySnapshot => {
            console.log(querySnapshot);
            console.log(querySnapshot.id);
            
            querySnapshot.forEach(doc => {
                console.log(doc.data());
                
            })
        })
        this.props.firebase.chats().get().then(res => {console.log(res)});
    }

    onSubmit = (event) => {
        const { fromID, toID } = this.props;
        const { message, timestamp } = this.state;
        event.preventDefault();
        this.addChatIdToUsers();
        console.log(fromID, toID, message);
        const chatroomRef = this.props.firebase.chats().doc(`${fromID}${toID}`).collection(`messages`);
        chatroomRef.doc().set({ message, fromID, toID, timestamp }).then(docRef => {
            console.log(docRef);
            // use chat(id) to set new Obj
        })
            .catch(function (error) {
                console.error('Error adding document: ', error);
            });
    }

    onChange = event => {
        const { fromID, toID } = this.props;
        this.setState({ [event.target.name]: event.target.value, fromID, toID, timestamp: Date.now() });
    };

    findDocID = ({ docs }) => docs[0].id;

    userChatsObjUpdate = async (userID) => {
        const { fromID, toID } = this.props;
        const userIDobject = await this.props.firebase.geoUsers().where('id', '==', userID).get();
        const userIDdocID = this.findDocID(userIDobject);
        const userIDref = this.props.firebase.geoUsers().doc(userIDdocID);
        const userChats = userIDref.docs[0].data().chats;
        userChats.push(`${fromID}${toID}`);
        userIDref.set({ chats: userChats }, { merge: true })
    }

    addChatIdToUsers = async () => {
        const { fromID, toID } = this.props;
        this.userChatsObjUpdate(fromID);
        this.userChatsObjUpdate(toID);

        // const fromIDobject = await this.props.firebase.geoUsers().where('id', '==', fromID).get();
        // const fromIDdocID = this.findDocID(fromIDobject);
        // const fromIDref = this.props.firebase.geoUsers().doc(fromIDdocID);
        // const chatsFrom = fromIDobject.docs[0].data().chats;

        // const toIDobject = await this.props.firebase.geoUsers().where('id', '==', toID).get();
        // const toIDdocID = this.findDocID(toIDobject);
        // const toIDref = this.props.firebase.geoUsers().doc(toIDdocID);
        // const chatsTo = toIDobject.docs[0].data().chats;
        // chatsFrom.push(`${fromID}${toID}`);
        // chatsTo.push(`${fromID}${toID}`);
        // fromIDref.set({chats: chatsFrom},{merge:true})
        // toIDref.set({chats:chatsTo},{merge:true})

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