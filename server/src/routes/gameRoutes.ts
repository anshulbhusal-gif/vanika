import { Router } from 'express';
import { GameController } from '../controllers/gameController';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import { uploadSinglePhoto } from '../middleware/uploadMiddleware';
import { validateGameQuery, validateCreateGame } from '../validators/gameValidator';

const router = Router();

// Require authentication for all game endpoints
router.use(authMiddleware);

// Public / Gameplay endpoints
router.get('/', validateGameQuery, GameController.getGames);
router.get('/:id', GameController.getGameById);
router.get('/:id/questions', GameController.getGameQuestions);

// Caregiver / Content management photo upload endpoint (POST /api/games/content/upload-photo)
router.post('/content/upload-photo', requireRole('CAREGIVER', 'ADMIN'), uploadSinglePhoto('photo'), GameController.uploadPhoto);
router.delete('/content/:id', requireRole('CAREGIVER', 'ADMIN'), GameController.deleteContentItem);

// Admin-only content management endpoints
router.post('/', requireRole('ADMIN'), validateCreateGame, GameController.createGame);
router.put('/:id', requireRole('ADMIN'), GameController.updateGame);
router.delete('/:id', requireRole('ADMIN'), GameController.deleteGame);

export default router;

