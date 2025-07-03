import express from 'express';
import { askGemini } from '../config/Gemini .js';

const router = express.Router();

router.post('/ask', async (req, res) => {
  const { prompt } = req.body;

  try {
    const reply = await askGemini(prompt);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
