import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://127.0.0.1:5000'); 

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ username: string; body: string }[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    socket.on('message', (message: { username: string; body: string }) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

   
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (messageBody: string) => {
    const message = {
      username,
      body: messageBody,
    };
    socket.emit('sendMessage', message);
    setMessageInput('');
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const messageBody = messageInput.trim();
    if (messageBody !== '') {
      sendMessage(messageBody);
    }
  };

  const handleUsernameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username.trim() !== '') {
      setIsLoggedIn(true);
    } else {
      alert('Please enter a username.');
    }
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  if (!isLoggedIn) {
    return (
      <div>
        <h1>Chatting App Login</h1>
        <form onSubmit={handleUsernameSubmit}>
          <label>Enter your username:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1>Text box</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="message"
          placeholder="enter your message"
          value={messageInput}
          onChange={(event) => setMessageInput(event.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <div>
        {messages.map((msg, index) => (
          <div key={index} className={msg.username === username ? 'sent' : 'received'}>
            <strong>{msg.username}: </strong>
            <span>{msg.body}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;