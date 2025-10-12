import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const get: APIRoute = ({ request }) => {
  return new Response(JSON.stringify({ message: 'This endpoint only accepts POST requests' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const post: APIRoute = async ({ request }) => {
  const GOOGLE_API_KEY = import.meta.env.GOOGLE_API_KEY;
  
  if (!GOOGLE_API_KEY) {
    return new Response(JSON.stringify({ 
      error: 'API key not configured. Please add GOOGLE_API_KEY to your .env file.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { message } = await request.json();
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    
    return new Response(JSON.stringify({ response: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: 'An error occurred while processing your request.',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};