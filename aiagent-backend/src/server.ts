import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ChatRequest, ChatResponse } from './types';
import OpenAI from 'openai';

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.LLM_API_KEY
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/api/v1/chat', async (req, res) => {
  try {
    const { message } = req.body as ChatRequest;
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",  // You can change this to your preferred model
      messages: [
        { role: "user", content: message }
      ],
      max_tokens: 5000,
      temperature: 0.1,
    });
    
    // Extract the response text
    const responseText = completion.choices[0]?.message?.content || "No response generated";
    
    const response: ChatResponse = {
      message: responseText
    };
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});