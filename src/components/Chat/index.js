import React, { PureComponent } from 'react'
import { withFirebase } from '../Firebase';

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

    onSubmit = (event) => {
        const { firebase, fromID, toID } = this.props;
        const { message } = this.state;
        event.preventDefault();
        console.log(firebase, fromID, toID, message);
        this.props.firebase.chats().doc(`${fromID}${toID}`).collection(`${fromID}`).add().set({t:'ttt5',w:'ffff5'}, {merge: true}).then(docRef =>{
            console.log(docRef);
            // use chat(id) to set new Obj
        })
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const {message} = this.state;
        return (
            <form onSubmit={this.onSubmit}>
                <ul>
                    <li>message 1</li>
                    <li>message 21</li>
                    <li>message 3</li>
                    <li>message 4</li>
                </ul>
                <input name="message" type="text" defaultValue={message} placeholder="Your message" onChange={this.onChange}/>
                <button type="submit">Send</button>
            </form>
        )

    }
}

const ChatPage = withFirebase(ChatBase);
export default ChatPage;