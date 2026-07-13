'use client';

import React, { useState } from 'react';
import { api } from '../../../context/AuthContext';
import { MessageSquareCode, Mic, Send, Bot, User, Volume2, Sparkles, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am your Agro AI Assistant. Ask me anything about crop suggestions, disease diagnostics, soil nutrients, or mandi commodity market rates.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const newUserMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.post('/chat', { message: textToSend });
      const reply = response.data.reply;

      const newBotMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: reply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newBotMsg]);
    } catch (err) {
      console.error(err);
      const errorBotMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Sorry, I encountered an error communicating with the Agro AI backend. Please verify your connection settings.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorBotMsg]);
    } finally {
      setIsTyping(false);
    }
  };


  const startVoiceInput = () => {
    setIsListening(true);
    // Simulate speech-to-text
    setTimeout(() => {
      setInput('What fertilizer is best for Basmati rice?');
      setIsListening(false);
    }, 2000);
  };

  const suggestedQuestions = [
    'How do I treat Early Blight on Tomato?',
    'What fertilizer is best for Basmati rice?',
    'When is the next PM-KISAN payment?'
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MessageSquareCode className="w-6 h-6 text-agro-600" />
          Smart Agro AI Chatbot
        </h2>
        <p className="text-sm text-slate-500">Instant answers regarding soil metrics, disease management, and government subsidy details.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[550px] overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-agro-500 text-white rounded-2xl">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Agro AI Copilot</h4>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                Online & Ready
              </span>
            </div>
          </div>
        </div>

        {/* Message body list */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';

            return (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[80%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`p-2 h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  isBot ? 'bg-agro-100 text-agro-700' : 'bg-slate-200 text-slate-700'
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm text-xs leading-relaxed font-semibold ${
                  isBot 
                    ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm' 
                    : 'bg-agro-600 text-white rounded-tr-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          {isTyping && (

            <div className="flex gap-3 max-w-[80%] mr-auto items-center">
              <div className="p-2 h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold bg-agro-100 text-agro-700 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-sm text-xs font-semibold text-slate-500 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-agro-600" />
                Agro AI is thinking...
              </div>
            </div>
          )}
        </div>


        {/* Suggestions Panel */}
        <div className="px-6 py-3 border-t border-slate-100 bg-white flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[10px] font-bold text-agro-700 bg-agro-50 hover:bg-agro-100 px-3 py-1.5 rounded-full transition-all border border-agro-100/50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input panel */}
        <div className="p-4 border-t border-slate-100 bg-white flex gap-3 items-center">
          <button
            onClick={startVoiceInput}
            className={`p-3 rounded-xl border transition-all ${
              isListening 
                ? 'bg-red-50 border-red-200 text-red-500 animate-pulse' 
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title="Voice Input (Speech Mock)"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder={isListening ? 'Listening for speech inputs...' : 'Type agricultural question...'}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-agro-500 focus:bg-white transition-all font-semibold"
            disabled={isListening}
          />

          <button
            onClick={() => handleSend(input)}
            className="p-3 bg-agro-600 text-white rounded-xl hover:bg-agro-700 shadow-md shadow-agro-100 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
