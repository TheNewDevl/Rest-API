import * as sauceControllers from '../controllers/sauce-ctrl'
import express from 'express'
import auth from '../middleware/auth'
import multer from '../middleware/multer-config'
import checkID from '../middleware/own-sauce'
import inputsCheck from '../middleware/inputs-check'

const router = express.Router()

router.get('/', auth, sauceControllers.getAllSauces)
router.get('/:id', auth, sauceControllers.getOneSauce)
router.post('/', auth, multer, inputsCheck, sauceControllers.createSauce)
router.put('/:id', auth, checkID, multer, inputsCheck, sauceControllers.modifySauce)
router.delete('/:id', auth, checkID, sauceControllers.deleteSauce)
router.post('/:id/like', auth, sauceControllers.likeManagement)

export default router
