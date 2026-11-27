// src/modules/pronunciation/pronunciation.route.ts
import { Router } from 'express';
import multer from 'multer';
import { SpeechAIController } from './speech_ai.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/speech-ai/evaluate (Form-data: audio [file], vocabId [number])
router.post('/evaluate', upload.single('audio'), SpeechAIController.evaluate);

export default router;