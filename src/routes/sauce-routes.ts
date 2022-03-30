import * as sauceControllers from '../controllers/sauce-ctrl';
import express from 'express';
import auth from '../middleware/auth';
import multer from '../middleware/multer-config';
import checkID from '../middleware/own-sauce'

const router = express.Router()

router.get('/', auth, sauceControllers.getAllSauces);
router.get('/:id', auth, sauceControllers.getOneSauce);
router.post('/', auth, multer, sauceControllers.createSauce);
router.put('/:id', auth, checkID, multer, sauceControllers.modifySauce);
router.delete('/:id', auth, sauceControllers.deleteSauce);
router.post('/:id/like', auth, sauceControllers.likeManagement)

export default router;
