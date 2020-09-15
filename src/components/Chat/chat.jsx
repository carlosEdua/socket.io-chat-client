import React, { useState, useEffect } from 'react';
import querySearh from 'query-string';
import io from 'socket.io-client';
// components
import InfoBar from '../InfoBar/infoBar';
import InputField from '../InputField/inputField';
import Messages from '../Messages/messages';

let socket;

function Chat() {
    
    const [username, setUserName] = useState('');
    const [chatRoom, setchatRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const { name, room } = querySearh.parse(window.location.search);
    const SERVERPORT = 5000; 

    // join to chat
    useEffect(() => {
        // socket.io server connection
        socket = io(`localhost:${SERVERPORT}`);
        setUserName(name);
        setchatRoom(room);

        socket.emit('join-chat', {name, room}, () => {

        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [name, room, SERVERPORT]);

    // listen for messages
    useEffect(() => {
        socket.on('message', message => {
            setMessages(m => [
                ...m,
                message
            ]);
        })
    }, []);

    // send message
    const sendMessage = (ev) => {
        ev.preventDefault();
        if(message){
            socket.emit('send-message', message, () => setMessage(''));
        }
    }

    console.log(messages);

    return (
        <div className="container-full">
            <div className="container-center">
                <InfoBar room={chatRoom} />

                <Messages messages={messages} username={username} />

                <InputField
                    sendMessage={sendMessage}
                    setMessage={setMessage}
                    message={message}
                />
            </div>
        </div>
    )
}

export default Chat;