import { useState, useEffect, useRef } from 'react';

export default function ChatBox({ socket }) {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isOpen, setIsOpen] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!socket) return;

        const handleHistory = (history) => {
            setMessages(history);
        };

        const handleNewMessage = (msg) => {
            setMessages((prev) => [...prev, msg]);
        };

        socket.on('chatHistory', handleHistory);
        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('chatHistory', handleHistory);
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket]);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim() || !socket) return;
        socket.emit('sendMessage', inputText);
        setInputText('');
    };

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '16px',
                left: '16px',
                width: '320px',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                overflow: 'hidden',
                zIndex: 1000,
                fontFamily: 'sans-serif',
            }}
        >
            {/* ヘッダーバー */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    padding: '10px 14px',
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                }}
            >
                <span>Chat ({messages.length})</span>
                <span>{isOpen ? '▼' : '▲'}</span>
            </div>

            {/* メッセージ一覧と入力欄 */}
            {isOpen && (
                <>
                    <div
                        style={{
                            height: '200px',
                            overflowY: 'auto',
                            padding: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            fontSize: '14px',
                        }}
                    >
                        {messages.map((msg) => (
                            <div key={msg.id} style={{ wordBreak: 'break-word' }}>
                                <span style={{ color: '#2563eb', fontWeight: 'bold' }}>
                                    [{msg.timestamp}] {msg.sender}:{' '}
                                </span>
                                <span style={{ color: '#1f2937' }}>{msg.text}</span>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form
                        onSubmit={handleSend}
                        style={{
                            display: 'flex',
                            borderTop: '1px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                        }}
                    >
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}
                            placeholder="Type a message..."
                            style={{
                                flex: 1,
                                border: 'none',
                                padding: '10px',
                                outline: 'none',
                                fontSize: '14px',
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#3b82f6',
                                color: '#ffffff',
                                border: 'none',
                                padding: '0 16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                            }}
                        >
                            Send
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}