import React, { useState, useRef} from 'react';
import axios from 'axios';
import { useTranslation } from "react-i18next";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const ChatBot = ({respuestaCorrecta, mode, language}) => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState([
        { text: t("llm-welcome"), sender: 'bot' },
    ]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        try {
            const response = await axios.post(`${apiEndpoint}/askllm`, {
                question: input,
                model: 'gemini',
                mode: mode,
                resCorr: respuestaCorrecta,
                language: language || "es"
            });

            const llmResponse = { 
                text: response.data.answer || t("errors.invalid-response"),
                sender: 'bot',
            };
            setMessages(prev => [...prev, { text: input, sender: 'user' }, llmResponse]);
            setInput('');
        } catch (error) {
            console.error('Error:', error);
            setMessages((prev) => [...prev, {
                    text: t("errors.llm"),
                    sender: 'bot',
                },
            ]);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '45vh', 
                width: '20vw',
                backgroundColor: '#2c3e50',
                color: '#ecf0f1',
                padding: '1%',
                borderRadius: '0.5rem',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                position: 'fixed',
                bottom: '2%',
                left: '2%', 
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '1rem', color: '#ecf0f1' }}>Chat</h2>
            </div>

            <div
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1%',
                    backgroundColor: '#34495e',
                    borderRadius: '0.5rem',
                }}
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor: message.sender === 'user' ? '#1abc9c' : '#95a5a6',
                            color: '#ffffff',
                            borderRadius: '0.5rem',
                            padding: '0.5rem',
                            margin: '0.3rem 0',
                            alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '70%',
                            fontSize: '0.9rem',
                        }}
                    >
                        {message.text}
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap', // Permitir que los elementos se ajusten en pantallas pequeñas
                    gap: '0.5rem', // Espaciado entre el input y el botón
                    marginTop: '0.5rem',
                }}
            >
                <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #ccc',
                        backgroundColor: '#ecf0f1',
                        color: '#2c3e50',
                        fontSize: '0.9rem',
                        minWidth: '70%',
                    }}
                />
                <button
                    onClick={handleSendMessage}
                    style={{
                        marginLeft: '0.5rem',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        flexShrink: 0,
                    }}
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};

export default ChatBot;
