import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Chat.css';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [token] = useState(localStorage.getItem('token'));
    const [userId] = useState(localStorage.getItem('userId'));
    const socketRef = useRef(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (token && !socketRef.current) {
            socketRef.current = io('http://localhost:8000', { query: { token } });

            // Load initial message history
            loadMessages();

            socketRef.current.on('receiveMessage', (newMessage) => {
                newMessage.createdAt = new Date(newMessage.createdAt).toLocaleTimeString();
                setMessages(prevMessages => [...prevMessages, newMessage]);
                if (!isSearching) {
                    scrollToBottom();
                }
            });

            socketRef.current.on('loadHistory', (history) => {
                if (history.length === 0) {
                    setHasMore(false);
                }
                setMessages(prevMessages => [...history.map(msg => ({
                    ...msg,
                    createdAt: new Date(msg.createdAt).toLocaleTimeString()
                })), ...prevMessages]);
                setPage(prevPage => prevPage + 1);
                setLoading(false);
            });

            socketRef.current.on('searchResults', (results) => {
                setSearchResults(results.map(result => ({
                    ...result,
                    createdAt: new Date(result.createdAt).toLocaleTimeString(),
                })));
                setIsSearching(true); // Ensure this is set correctly
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [token]);

    // Function to load messages
    const loadMessages = () => {
        if (loading || !hasMore) return;
        setLoading(true);
        socketRef.current.emit('requestHistory', { skip: page * 10, take: 10 });
    };

    const handleScroll = (e) => {
        if (e.target.scrollTop === 0 && hasMore && !loading) {
            loadMessages();
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        if (event.target.value.trim()) {
            socketRef.current.emit('searchMessages', { query: event.target.value });
        } else {
            setIsSearching(false);
            setSearchResults([]);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            socketRef.current.emit('sendMessage', JSON.stringify({ content: message, userId }));
            setMessage('');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="chat-container">
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search messages..."
                className="search-input"
            />
            <div className="messages" onScroll={handleScroll}>
                {loading && <div>Loading...</div>}
                {isSearching ? (
                    searchResults.map((msg, index) => (
                        <div key={index} className={`message ${msg.userId === userId ? 'sent' : 'received'}`}>
                            <div className="content">
                                <p>{msg.content}</p>
                                <span className="username">{msg.user.username || "Anonymous"}</span>
                                <span className="timestamp">{msg.createdAt}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.userId === userId ? 'sent' : 'received'}`}>
                            <div className="content">
                                <p>{msg.content}</p>
                                <span className="username">{msg.user.username || "Anonymous"}</span>
                                <span className="timestamp">{msg.createdAt}</span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            <form className="message-form" onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default Chat;
