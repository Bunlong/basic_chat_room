import React, { Component } from 'react';

import RoomForm from './RoomForm';
import io from "socket.io-client";
let socket = io(`http://localhost:8000`)

class App extends Component {
  state = {
    data: [],
    typing:   false,
    timeout:  undefined,
    users:    [],
    test: ""
  }

  resetTyping = () => {
    this.setState({typing: false});
    socket.emit('user_typing', false);
  }

  submit = values => {
    socket.emit('chat_message', {
      message: values.text
    });
  }

  change = (e) => {
    if (e.key !== 'Enter') {
      if (this.state.typing === false) {
        this.setState({typing: true});
        socket.emit('user_typing', true);
        this.setState({timeout: setTimeout(this.resetTyping, 3000)});
      } else {
        clearTimeout(this.setState.timeout);
        this.setState({timeout: setTimeout(this.resetTyping, 3000)});
      }
    }
  }

  componentDidMount = () => {
    socket.on('notify_user', (user) => {
      console.log(`You have joined as ${user}`);
    });

    socket.on('user_connected', (user) => {
      console.log(`${user} has joined.`);
    });

    socket.on('user disconnected', (user) => {
      console.log(`${user} has left.`);
    });

    socket.on('user_typing', (msg) => {
      var i = this.state.users.indexOf(msg.nickname);

      if (msg.isTyping) {
        if (i === -1) {
          this.state.users.push(msg.nickname);
        }
      } else {
        if (i !== -1) {
          this.state.users.splice(i, 1);
        }
      }

      switch(this.state.users.length) {
        case 0:
          console.log('');
          break;
        case 1:
          console.log(`${this.state.users[0]} is typing...`);
          break;
        case 2:
          console.log(`${this.state.users[0]} and ${this.state.users[1]} are typing...`);
          break;
        default:
          console.log('Multiple users are typing...');
          break;
      }
    });


    socket.on('chat_message', (msg) => {
      var msg = `[${msg.time}] - [${msg.nickname}]: ${msg.message}`;

      clearTimeout(this.state.timeout);
      this.setState({timeout: setTimeout(this.resetTyping, 0)});
      let updated = this.state.data.slice();
      updated.push(msg);
      this.setState({data: updated});
    });
  }

  render() {
    return (
      <div>
        <RoomForm data={this.state.data} onSubmit={this.submit} handleChange={this.change} />
      </div>
    );
  }
}

export default App;