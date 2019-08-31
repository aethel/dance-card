import React from 'react';
import { withFirebase } from '../../Firebase';
import { map, flatMap, takeLast } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { collection } from 'rxfire/firestore';

const uid = sessionStorage.getItem('uid');

class MessageListBase extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    const fromRef = this.props.firebase.chats().where('fromID', '==', uid);
    const toRef = this.props.firebase.chats().where('toID', '==', uid);
    const fromRef$ = collection(fromRef);
    const toRef$ = collection(toRef);

    const messages$ = combineLatest(fromRef$, toRef$).pipe(
      flatMap(msgs => {
        const [incoming, sent] = msgs;
        return [...incoming, ...sent];
      }),
      map(docs => docs.data())
    );
    messages$.subscribe((item, index) => {
      const messages = [...this.state.messages, item];
      this.setState({ messages });
    });
  }

  render() {
    const { messages } = this.state;
    console.log(messages);

    return (
      <ul>
        {/* {messages.sort((item1, item2) => item1.timestamp > item2.timestamp ).map((item, index) => ( */}
        {this.props.messages
          .sort((item1, item2) => item1.timestamp > item2.timestamp)
          .map((item, index) => (
            <li key={`${item.message}${index}`}>
              <time>
                {new Date(item.timestamp).toLocaleDateString('en-GB', {
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </time>
              <p>{item.message}</p>
            </li>
          ))}
      </ul>
    );
  }
}

const MessagesList = withFirebase(MessageListBase);
export default MessagesList;
