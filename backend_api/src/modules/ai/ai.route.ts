import { Router } from 'express';
import { AiController } from './ai.controller';

const router = Router();

// GET /api/ai/study-plan/:userId
router.get('/study-plan/:userId', AiController.getStudyPlan);

export default router;