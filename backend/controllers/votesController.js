import express from 'express';
import jwt from 'jsonwebtoken';
import { getQuestion, setQuestion, vote, getResults } from '../services/contractService.js';

const router = express.Router();

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

router.get('/get', authenticateToken, async (req, res) => {
  try {
    const question = await getQuestion();
    res.status(200).json({ message: question });
  } catch (err) {
    console.error('Get question error:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/set', authenticateToken, async (req, res) => {
  const { newQuestion } = req.body;
  if (!newQuestion) {
    return res.status(400).json({ message: 'New question is required' });
  }

  try {
    await setQuestion(newQuestion);
    res.status(200).json({ message: 'Question has been set' });
  } catch (err) {
    console.error('Set question error:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/vote', authenticateToken, async (req, res) => {
  const { answer } = req.body;
  if (!answer) {
    return res.status(400).json({ message: 'Answer is required' });
  }

  try {
    await vote(answer);
    res.status(200).json({ message: 'Vote has been submitted' });
  } catch (err) {
    console.error('Vote error:', err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/results', authenticateToken, async (req, res) => {
  try {
    const results = await getResults();
    res.status(200).json(results);
  } catch (err) {
    console.error('Get results error:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
