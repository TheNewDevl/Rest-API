import * as userControllers from '../controllers/user-ctrl'
import express from 'express';

const router = express.Router()

router.post('/signup', userControllers.signUp)
router.post('/login', userControllers.login)

export default router 