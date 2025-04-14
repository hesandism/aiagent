import React, { useState, useRef, useEffect } from 'react';
import { Briefcase, Send } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import type { Message, ChatState } from './types';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([] as Message[]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };

    setMessages((p) => [...p, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      const response = await fetch(`${import.meta.env.VITE_AGENT_API_URL}/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
   
      setIsLoading(false)
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false)
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="border-b">
        <div className="max-w-3xl mx-auto py-4 px-4">
          <h1 className="text-xl font-semibold text-gray-800">AI Chat Assistant</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Start a conversation by typing a message below.</p>
          </div>
        ) : (
          <div>
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && (
              <div className="py-8 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4">
                  <div className="flex gap-2 items-center text-gray-500">
                    <Send className="w-5 h-5 animate-pulse" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <footer className="border-t bg-white">
        <div className="max-w-3xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your messaAAAAge..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-red-800 text-white rounded-lg px-4 py-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-pointer flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
            <button
              type="button"
              onClick= {() => setInput('')}
              disabled={isLoading || !input.trim()}
              className="bg-green-800 text-blue rounded-lg px-4 py-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-pointer flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              Clear
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}

export default App;