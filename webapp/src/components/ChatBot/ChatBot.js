import React, { useState, useRef} from 'react';
import axios from 'axios';

const ChatBot = ({respuestaCorrecta }) => {
    const [messages, setMessages] = useState([
        { text: '¡Hola! Soy tu asistente. ¿En que puedo ayudarte?', sender: 'bot' },
    ]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);

    const handleSendMessage = async () => {
        if (!input.trim()) return;
    
        try {
            const response = await axios.post('http://localhost:8003/ask', {
                question: input,
                model: 'gemini',
                resCorr: respuestaCorrecta  
            });
    
            const llmResponse = { 
                text: response.data.answer || "No pude obtener una respuesta válida.", 
                sender: 'bot' 
            };
            
            setMessages(prev => [...prev, { text: input, sender: 'user' }, llmResponse]);
            setInput('');
            
        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [...prev, { 
                text: "Ocurrió un error al procesar tu pregunta.", 
                sender: "bot" 
            }]);
        }
    };


    return (
        <div style={{
            display: 'flex', 
            flexDirection: 'column', 
            height: '400px', 
            width: '300px', 
            backgroundColor: '#2c3e50', 
            color: '#ecf0f1', 
            padding: '16px', 
            borderRadius: '8px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
            position: 'fixed', 
            bottom: '20px',   
            left: '20px',    
            zIndex: 1000     
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '8px' 
            }}>
                <h2 style={{ margin: 0, color: '#ecf0f1' }}>Chat</h2>
            </div>
        
            <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: '8px', 
                backgroundColor: '#34495e',
                borderRadius: '5px' 
            }}>
                {messages.map((message, index) => (
                    <div key={index} style={{
                        backgroundColor: message.sender === 'user' ? '#1abc9c' : '#95a5a6',
                        color: '#ffffff',
                        borderRadius: '12px', 
                        padding: '10px', 
                        margin: '5px 0',
                        alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '70%'
                    }}>
                        {message.text}
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
        
            <div style={{ 
                display: 'flex', 
                marginTop: '8px' 
            }}>
                <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    style={{ 
                        flex: 1, 
                        padding: '10px', 
                        borderRadius: '5px', 
                        border: '1px solid #ccc',
                        backgroundColor: '#ecf0f1', 
                        color: '#2c3e50' 
                    }}
                />
                <button onClick={handleSendMessage} style={{
                    marginLeft: '8px', 
                    padding: '10px', 
                    borderRadius: '5px',
                    backgroundColor: '#e74c3c', 
                    color: 'white', 
                    border: 'none', 
                    cursor: 'pointer'
                }}>
                    Enviar
                </button>
            </div>
        </div>
    );
};

export default ChatBot;