import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

interface Chat {
  id: string;
  question: string;
  response: string;
  createdAt: string;
}

interface AskTerraAICardProps {
  gardenId: string;
  gardenName?: string;
  bedCount?: number;
  activePlantings?: number;
  usdaZone?: string;
  plantingId?: string;
  stressedPlantings?: number;
  harvestSoonCount?: number;
}

export default function AskTerraAICard({ 
  gardenId, 
  gardenName,
  bedCount,
  activePlantings,
  usdaZone,
  plantingId,
  stressedPlantings,
  harvestSoonCount
}: AskTerraAICardProps) {
  const [question, setQuestion] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  useEffect(() => {
    loadHistory();
  }, [gardenId]);

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/ai/history?scope_type=garden&scope_id=${gardenId}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setChats(response.data.reverse());
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent, presetQuestion?: string) => {
    if (e) e.preventDefault();
    
    const questionText = presetQuestion || question;
    if (!questionText.trim()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/ai/ask`,
        { 
          question: questionText, 
          gardenId, 
          plantingId,
          scope_type: 'garden',
          scope_id: gardenId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChats([...chats, response.data]);
      setQuestion('');
    } catch (err: any) {
      console.error('AI request failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSubmit(undefined, suggestion);
  };

  // Generate dynamic suggestions based on garden data
  const getSuggestions = () => {
    const suggestions: string[] = [];
    
    if (stressedPlantings && stressedPlantings > 0) {
      suggestions.push(`I have ${stressedPlantings} struggling plants. What should I check?`);
    }
    
    if (harvestSoonCount && harvestSoonCount > 0) {
      suggestions.push(`${harvestSoonCount} crops ready soon. When's the best time to harvest?`);
    }
    
    suggestions.push('What should I plant this month?');
    suggestions.push('How often should I water?');
    suggestions.push('Tips for improving soil health?');
    
    return suggestions.slice(0, 4);
  };

  const suggestions = getSuggestions();

  return (
    <Card
      title="🌱 Ask Terra AI"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '400px'
      }}
    >
      {/* Context Strip */}
      <div style={{
        padding: '0.75rem',
        backgroundColor: 'var(--color-bg-muted)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.875rem',
        color: 'var(--color-text-muted)',
        marginBottom: 'var(--space-4)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        alignItems: 'center'
      }}>
        <strong style={{ color: 'var(--color-text)' }}>Using:</strong>
        {gardenName && <span>🏡 {gardenName}</span>}
        {bedCount !== undefined && <span>• {bedCount} containers</span>}
        {activePlantings !== undefined && <span>• {activePlantings} greenhouses</span>}
        {usdaZone && <span>• Zone {usdaZone}</span>}
      </div>

      <div style={{ 
        fontSize: '0.95rem',
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--space-4)'
      }}>
        How can I help your garden today?
      </div>

      {/* Chat Window */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: 'var(--space-4)',
        padding: '0.5rem',
        backgroundColor: '#fafaf9',
        borderRadius: 'var(--radius-md)',
        minHeight: '200px',
        maxHeight: '320px'
      }}>
        {loadingHistory ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
            Loading conversation...
          </div>
        ) : chats.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
            <p style={{ margin: '0 0 1rem 0' }}>👋 Start a conversation about your garden!</p>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Ask about watering, pests, timing, or anything else.</p>
          </div>
        ) : (
          <>
            {chats.map((chat) => (
              <div key={chat.id} style={{ marginBottom: 'var(--space-4)' }}>
                {/* User Message */}
                <div style={{
                  backgroundColor: '#d1fae5',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '0.5rem',
                  maxWidth: '85%',
                  marginLeft: 'auto'
                }}>
                  <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: '0.25rem' }}>You:</div>
                  <div>{chat.question}</div>
                </div>

                {/* AI Response */}
                <div style={{
                  backgroundColor: 'white',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border-light)',
                  maxWidth: '85%',
                  lineHeight: '1.6'
                }}>
                  <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: '0.25rem', color: 'var(--color-primary)' }}>
                    Terra AI:
                  </div>
                  <div>{chat.response}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                    {new Date(chat.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{
                backgroundColor: 'white',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border-light)',
                maxWidth: '85%',
                fontStyle: 'italic',
                color: 'var(--color-text-muted)'
              }}>
                <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: '0.25rem', color: 'var(--color-primary)' }}>
                  Terra AI:
                </div>
                Looking at your garden...
              </div>
            )}

            <div ref={chatEndRef} />
          </>
        )}
      </div>

      {/* Suggested Prompts */}
      {chats.length === 0 && !loadingHistory && (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ 
            fontSize: '0.875rem', 
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--space-2)',
            color: 'var(--color-text-muted)'
          }}>
            Quick questions:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={loading}
                style={{
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.8125rem',
                  backgroundColor: 'white',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  color: 'var(--color-text)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = 'var(--color-border-light)';
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about your garden..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9375rem'
          }}
        />
        <Button
          type="submit"
          disabled={loading || !question.trim()}
          variant="primary"
          size="md"
        >
          {loading ? '...' : '📤'}
        </Button>
      </form>

      {/* Link to Full Assistant */}
      <div style={{ marginTop: 'var(--space-3)', textAlign: 'center' }}>
        <button
          onClick={() => navigate(`/ai-assistant?gardenId=${gardenId}`)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-primary)',
            fontSize: '0.875rem',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Open Full Assistant →
        </button>
      </div>
    </Card>
  );
}
