import { useState, useRef, useEffect, useCallback } from 'react';
import { useRobot } from '../context';
import { useTypingDetection, analyzeMessage, useAIChatRobot } from '../hooks';
import { aiService, ChatHistoryMessage } from '../../../services/aiService';
import { ChatMessage } from '../types';

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'ai' as const,
  content: "Hi! I'm LearnBot, your coding assistant. How can I help you today?",
  timestamp: new Date(),
};

const MAX_HISTORY = 10;

export const ChatBox = ({ isOpen, onClose }: ChatBoxProps) => {
  const { state, stop } = useRobot();
  const { onAiThinking, onAiResponse, onAiError } = useAIChatRobot();
  
  const { isTyping, handleInputChange, reset } = useTypingDetection({
    debounceMs: 1500,
    onTypingStart: () => {},
    onTypingEnd: () => {},
  });

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    handleInputChange(e.target.value);
  }, [handleInputChange]);

  const toServiceMessages = useCallback((msgs: typeof messages): ChatHistoryMessage[] => {
    return msgs
      .filter(m => m.id !== 'welcome')
      .slice(-MAX_HISTORY)
      .map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        content: m.content,
      }));
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'ai' as const,
      content: input.trim(),
      timestamp: new Date(),
    };

    handleInputChange('');
    reset();
    analyzeMessage(input);

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    onAiThinking();

    try {
      const response = await aiService.chat({
        message: userMessage.content,
        conversationHistory: toServiceMessages(messages),
      });

      if (response.success && response.message) {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          role: 'ai' as const,
          content: response.message,
          timestamp: new Date(response.timestamp || Date.now()),
        };
        setMessages(prev => [...prev, aiMessage]);
        onAiResponse(response.message);
      } else {
        throw new Error(response.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai' as const,
        content: `Sorry, I couldn't process your message. ${errorMsg.includes('Failed to fetch') ? 'Please check your connection.' : 'Please try again.'}`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      onAiError();
    } finally {
      setLoading(false);
    }
  }, [input, loading, handleInputChange, reset, messages, toServiceMessages, onAiThinking, onAiResponse, onAiError]);

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  }, [sendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const getStatusLabel = () => {
    if (loading) return 'Thinking...';
    if (state === 'speaking') return 'Speaking...';
    if (state === 'thinking') return 'Listening...';
    return 'AI Coding Assistant';
  };

  const getRobotEmoji = () => {
    if (state === 'speaking') return '🗣️';
    if (state === 'thinking') return '🤔';
    if (state === 'excited') return '🎉';
    if (state === 'confused') return '😕';
    if (state === 'celebrating') return '🏆';
    return '🤖';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-primary-500 to-primary-600 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-all ${
            state === 'speaking' ? 'animate-pulse scale-110' : 
            state === 'thinking' ? 'animate-bounce' : ''
          }`}>
            <span className="text-xl">{getRobotEmoji()}</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">LearnBot</h3>
            <p className="text-xs text-white/80">{getStatusLabel()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={clearChat} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors" title="Clear chat">
            <span className="text-white text-sm">🗑</span>
          </button>
          <button onClick={stop} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors" title="Stop speaking">
            <span className="text-white">⏹</span>
          </button>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <span className="text-white text-lg">×</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={onInputChange}
            onKeyDown={handleKeyPress}
            placeholder={isTyping ? "I'm listening..." : "Ask me anything..."}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <LoadingSpinner /> : <SendIcon />}
          </button>
        </div>
      </form>
    </div>
  );
};

const MessageBubble = ({ message }: { message: { role: string; content: string; timestamp: Date; id: string } }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
        isUser ? 'bg-primary-600 text-white rounded-br-md' : 'bg-gray-100 text-gray-800 rounded-bl-md'
      }`}>
        {!isUser && <p className="text-xs text-gray-500 mb-1">LearnBot</p>}
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-white/70' : 'text-gray-400'}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex justify-start animate-fadeIn">
    <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
      <div className="flex gap-1">
        {[0, 150, 300].map((delay) => (
          <div key={delay} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
        ))}
      </div>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default ChatBox;
