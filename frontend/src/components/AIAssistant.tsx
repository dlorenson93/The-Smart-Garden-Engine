import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Chat {
  id: string;
  question: string;
  response: string;
  createdAt: string;
}

interface AIAssistantProps {
  gardenId?: string;
  plantingId?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ gardenId, plantingId }) => {
  const [question, setQuestion] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/ai/history?limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(response.data.reverse());
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/ai/ask`,
        { question, gardenId, plantingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChats([...chats, response.data]);
      setQuestion('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant">
      <div className="ai-chat-header">
        <h3>🌱 Garden AI Assistant</h3>
        <p>Ask me anything about gardening!</p>
      </div>

      <div className="ai-chat-history">
        {chats.length === 0 && (
          <div className="ai-empty-state">
            <p>👋 Hi! I'm your garden assistant. Ask me about:</p>
            <ul>
              <li>Watering schedules</li>
              <li>Fertilizing tips</li>
              <li>Pest and disease management</li>
              <li>Planting and harvest timing</li>
              <li>Companion planting</li>
              <li>Soil health</li>
            </ul>
          </div>
        )}

        {chats.map((chat) => (
          <div key={chat.id} className="ai-chat-message">
            <div className="ai-question">
              <strong>You:</strong> {chat.question}
            </div>
            <div className="ai-response">
              <strong>Assistant:</strong> {chat.response}
            </div>
            <div className="ai-timestamp">
              {new Date(chat.createdAt).toLocaleString()}
            </div>
          </div>
        ))}

        {loading && (
          <div className="ai-chat-message">
            <div className="ai-response">
              <strong>Assistant:</strong> <em>Thinking...</em>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="ai-chat-form">
        {error && <div className="error-message">{error}</div>}
        <div className="form-row">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a gardening question..."
            disabled={loading}
            className="ai-input"
          />
          <button type="submit" disabled={loading || !question.trim()}>
            {loading ? 'Sending...' : 'Ask'}
          </button>
        </div>
      </form>

      <style>{`
        .ai-assistant {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          height: 600px;
          max-height: 80vh;
        }

        .ai-chat-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-radius: 8px 8px 0 0;
        }

        .ai-chat-header h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
        }

        .ai-chat-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 0.875rem;
        }

        .ai-chat-history {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          background: #f9fafb;
        }

        .ai-empty-state {
          text-align: center;
          color: #6b7280;
          padding: 2rem;
        }

        .ai-empty-state ul {
          text-align: left;
          display: inline-block;
          margin-top: 1rem;
        }

        .ai-empty-state li {
          margin: 0.5rem 0;
        }

        .ai-chat-message {
          margin-bottom: 1.5rem;
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ai-question {
          background: #dbeafe;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 0.5rem;
        }

        .ai-response {
          background: white;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          line-height: 1.6;
        }

        .ai-timestamp {
          font-size: 0.75rem;
          color: #9ca3af;
          margin-top: 0.25rem;
          text-align: right;
        }

        .ai-chat-form {
          padding: 1.5rem;
          border-top: 1px solid #e5e7eb;
          background: white;
          border-radius: 0 0 8px 8px;
        }

        .ai-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
        }

        .ai-input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .form-row {
          display: flex;
          gap: 0.75rem;
        }

        .form-row button {
          padding: 0.75rem 1.5rem;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .form-row button:hover:not(:disabled) {
          background: #059669;
        }

        .form-row button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .error-message {
          background: #fee2e2;
          color: #991b1b;
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default AIAssistant;
