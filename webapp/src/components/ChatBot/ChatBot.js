import React, { useState, useRef} from 'react';
import axios from 'axios';

const ChatBot = ({setShowChat,respuestaCorrecta }) => {
    const [messages, setMessages] = useState([
        { text: '¡Hola! ¿Cómo puedo ayudarte?', sender: 'bot' },
    ]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);

    const handleSendMessage = async () => {
        try {
            let questionToSend = input; // Pregunta por defecto
    
            // Verificar si el usuario está preguntando por la respuesta correcta
            if (input.toLowerCase().includes("respuesta correcta") || input.toLowerCase().includes("respuesta") || input.toLowerCase().includes("imagen")) {
                questionToSend = `Contesta a la siguiente pregunta teniendo en cuenta que esta es la respuesta correcta: ${respuestaCorrecta}. Proporciona una explicación o pista sobre por qué esta es la respuesta correcta.`;
            }
    
            // Enviar la pregunta al LLM
            const response = await axios.post('http://localhost:8003/ask', {
                question: questionToSend,
                model: 'gemini'
            });
    
            const llmResponse = { 
                text: response.data.answer || "No se recibió una respuesta válida del LLM.", 
                sender: 'bot' 
            };
            setMessages((prevMessages) => [...prevMessages, llmResponse]);
        } catch (error) {
            console.error("Error al conectarse con el LLM:", error.response?.data || error.message);
            setMessages((prevMessages) => [...prevMessages, { 
                text: "Error al obtener la respuesta del servidor.", 
                sender: "bot" 
            }]);
        }
    };


    return (
        <div style={{
            display: 'flex', 
            flexDirection: 'column', 
            height: '400px', // Altura reducida
            width: '300px',  // Ancho reducido
            backgroundColor: '#f4f4f4', 
            padding: '16px', 
            borderRadius: '8px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
            position: 'fixed', // Posición fija
            bottom: '20px',   // Distancia desde la parte inferior
            left: '20px',     // Distancia desde la izquierda
            zIndex: 1000      // Asegura que el chat esté por encima de otros elementos
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '8px' 
            }}>
                <h2 style={{ margin: 0 }}>Chat</h2>
            </div>
        
            <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: '8px', 
                backgroundColor: '#fff', 
                borderRadius: '5px' 
            }}>
                {messages.map((message, index) => (
                    <div key={index} style={{
                        backgroundColor: message.sender === 'user' ? '#DCF8C6' : '#ffffff',
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
                        border: '1px solid #ccc' 
                    }}
                />
                <button onClick={handleSendMessage} style={{
                    marginLeft: '8px', 
                    padding: '10px', 
                    borderRadius: '5px',
                    backgroundColor: '#007bff', 
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