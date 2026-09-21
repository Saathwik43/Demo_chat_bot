import { useState } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('') // state variables are used to store the data that changes over time
  const [messages, setMessages] = useState([])
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const handleSend = async (e) => { // this variable is used to handle the sending part of the chat bot interface
    e.preventDefault()

    if (!input.trim()) return 

    const userMessage = input.trim()

    setMessages((prev) => [...prev, { role: 'user', text: userMessage }])
    setInput('')

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: data.error || 'Something went wrong' },
        ])
        return
      }

      setMessages((prev) => [...prev, { role: 'bot', text: data.reply }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Cannot reach the server. Is it running on port 5000?' },
      ])
    }
  }

  return (
    <div className="chat-app">
      <h1>Manual Chatbot</h1>

      <div className="messages">
        {messages.length === 0 && (
          <p className="empty">Send a message to start chatting</p>
        )}

        {messages.map((msg, index) => ( // 
          <div key={index} className={`message ${msg.role}`}>
            <span className="label">{msg.role === 'user' ? 'You' : 'Bot'}</span>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <form className="input-form" onSubmit={handleSend}> 
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default App