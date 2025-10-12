import { GoogleGenerativeAI } from '@google/generative-ai';
import type { APIRoute } from 'astro';

// Handle GET requests
export const GET: APIRoute = ({ params, request }) => {
  return new Response(JSON.stringify({
    message: "This endpoint requires a POST request"
  }), {
    status: 405,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// Handle POST requests
export const POST: APIRoute = async ({ request }) => {
  const GOOGLE_API_KEY = import.meta.env.GOOGLE_API_KEY;
  
  if (!GOOGLE_API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { message } = await request.json();
    
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}