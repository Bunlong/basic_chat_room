import React, { Component } from 'react';

import RoomForm from './RoomForm';
import io from "socket.io-client";

class App extends Component {
  state = {
    text: ""
  }

  submit = values => {

  }

  change = (e) => {
    if (e.key === 'Enter') {
      console.log('do validate');
    }
    console.log(e);
  }

  componentDidMount() {    
    
  }
  
  render() {
    return (
      <div>
        <RoomForm onSubmit={this.submit} onChange={this.change} />
      </div>
    );
  }
}

export default App;
