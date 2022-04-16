import * as userControllers from '../controllers/user-ctrl'
import express from 'express'
import { AppRouterInterface } from '../app'


const router = express.Router()

router.post('/signup', userControllers.signUp)
router.post('/login', userControllers.login)

export default {
    uri: '/api/auth',
    router: router
} as AppRouterInterface

