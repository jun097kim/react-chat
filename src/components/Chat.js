import React, { Component } from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import SockJS from 'sockjs-client';
import 'react-chat-widget/lib/styles.css';

const sock = new SockJS('http://localhost:8000/chat');

class Chat extends Component {
  componentDidMount = () => {
    // 메시지 도착 이벤트가 발생하면 메시지 추가
    sock.onmessage = e => {
      const content = JSON.parse(e.data);
      addResponseMessage(content.message);
    };
  };

  // 웹소켓 서버로 메시지 전송
  handleNewUserMessage = newMessage => {
    sock.send(JSON.stringify({ message: newMessage }));
  };

  render() {
    return (
      <Widget
        handleNewUserMessage={this.handleNewUserMessage}
        senderPlaceHolder="메시지를 입력하세요..."
      />
    );
  }
}

export default Chat;
