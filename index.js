import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ Missing GEMINI_API_KEY in environment variables.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Gemini Proxy Server Running');
});

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ result: text });
  } catch (error) {
    console.error('❌ Gemini Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
