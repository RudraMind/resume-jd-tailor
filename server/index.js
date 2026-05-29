import './config.js';
import express from 'express';
import cors from 'cors';
import { pipelineRouter } from './routes/pipeline.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.use('/api/step', pipelineRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', provider: process.env.LLM_PROVIDER || 'gemini' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
