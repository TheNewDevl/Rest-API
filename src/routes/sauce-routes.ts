import * as sauceControllers from '../controllers/sauce-ctrl';
import express from 'express';
import auth from '../middleware/auth';

const router = express.Router()

router.get('/', auth, sauceControllers.getAllSauces);
router.get('/:id', auth, sauceControllers.getOneSauce);

export default router;