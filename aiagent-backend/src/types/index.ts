export interface Message {
    role: 'user' | 'assistant';
    content: string;
  }
  
  export interface ChatRequest {
    message: string;
  }
  
  export interface ChatResponse {
    message: string;
  }