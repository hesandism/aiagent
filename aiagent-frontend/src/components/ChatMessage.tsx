import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
let p:number = 4;
interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === 'assistant';

  return (
    <div className={`py-8 ${isBot ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="max-w-3xl mx-auto flex gap-6 px-4">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          {isBot ? (
            <Bot className="w-6 h-6 text-blue-500" />
          ) : (
            <User className="w-6 h-6 text-gray-600" />
          )}
        </div>
        <div className="prose prose-sm max-w-none flex-1">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}