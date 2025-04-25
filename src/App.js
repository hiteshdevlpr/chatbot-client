import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import Header from './components/Header/Header';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f5f5f5;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 0.8rem 1.2rem;
  border-radius: 1rem;
  background-color: ${props => props.isUser ? '#007bff' : '#ffffff'};
  color: ${props => props.isUser ? '#ffffff' : '#333333'};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const Footer = styled.footer`
  padding: 1rem;
  background-color: #ffffff;
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SendButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const socketRef = useRef();
  const chatContainerRef = useRef();

  useEffect(() => {
    // Connect to Socket.IO server
    socketRef.current = io('http://localhost:3001');

    // Listen for incoming messages
    socketRef.current.on('message', (message) => {
      setMessages(prev => [...prev, { text: message, isUser: false }]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const newMessage = { text: inputMessage, isUser: true };
      setMessages(prev => [...prev, newMessage]);
      socketRef.current.emit('message', inputMessage);
      setInputMessage('');
    }
  };

  return (
    <AppContainer>
      <Header />
      <ChatContainer ref={chatContainerRef}>
        {messages.map((message, index) => (
          <MessageBubble key={index} isUser={message.isUser}>
            {message.text}
          </MessageBubble>
        ))}
      </ChatContainer>
      <Footer>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', width: '100%', gap: '0.5rem' }}>
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <SendButton type="submit">Send</SendButton>
        </form>
      </Footer>
    </AppContainer>
  );
}

export default App; 