import * as sauceControllers from '../controllers/sauce-ctrl';
import express from 'express';
import auth from '../middleware/auth';
import multer from '../middleware/multer-config';

const router = express.Router()

router.get('/', auth, sauceControllers.getAllSauces);
router.get('/:id', auth, sauceControllers.getOneSauce);
router.post('/', auth, multer, sauceControllers.createSauce);
router.put('/:id', auth, multer, sauceControllers.modifySauce);
router.delete('/:id', auth, sauceControllers.deleteSauce);
router.post('/:id/like', sauceControllers.likeManagement)

export default router;
