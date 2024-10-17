"use client"
import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/NavBar';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Toaster, toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const Chat = ({ token }) => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleChat = async () => {
    const token = localStorage.getItem('token');
    if (!query.trim()) {
      toast.error('Please enter a query');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Thinking...');
    try {
      setError('');
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, token, history: chatHistory }),
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const data = await res.json();

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: 'user', message: query },
        { role: 'model', message: data.response },
      ]);

      setQuery('');
      toast.success('Response received!', { id: loadingToast });
    } catch (error) {
      console.error(error);
      setError('Something went wrong. Please try again.');
      toast.error('Failed to get response', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setQuery('');
    setError('');
    toast.success('Chat cleared!');
  };

  const renderMessage = (message) => {
    const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeRegex.exec(message)) !== null) {
      if (match.index > lastIndex) {
        parts.push(message.slice(lastIndex, match.index));
      }
      const language = match[1] || 'javascript';
      const code = match[2].trim();
      parts.push(
        <SyntaxHighlighter 
          key={`code-${match.index}`} 
          language={language} 
          style={docco} 
          className="my-2 rounded-lg"
        >
          {code}
        </SyntaxHighlighter>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < message.length) {
      parts.push(message.slice(lastIndex));
    }

    return parts.map((part, index) => 
      typeof part === 'string' ? <span key={`text-${index}`}>{part}</span> : part
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <h2 className="text-3xl font-bold text-center py-6 bg-blue-600 text-white">EngiChat</h2>
          
          <div className="chat-history h-96 overflow-y-auto p-6 bg-gray-50">
            {chatHistory.map((chatItem, index) => (
              <div key={index} className={`mb-4 ${chatItem.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block max-w-3/4 p-3 rounded-lg ${
                  chatItem.role === 'user' ? 'bg-blue-200' : 'bg-green-200'
                }`}>
                  <p className="font-semibold mb-1">
                    {chatItem.role === 'user' ? 'You' : 'Assistant'}:
                  </p>
                  <div className="text-sm">{renderMessage(chatItem.message)}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center items-center mt-4">
                <Loader2 className="animate-spin text-blue-600" size={24} />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 bg-white">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything related to your college education..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4 resize-none"
              rows={2}
            />

            <button
              onClick={handleChat}
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-600 rounded-lg">
                <p>{error}</p>
              </div>
            )}

            <button
              onClick={clearChat}
              className="w-full mt-4 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-all"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;