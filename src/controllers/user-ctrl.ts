import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { Request, Response } from 'express'

import * as database from '../database/user.database'
import { Validation } from '../utils/validation'

/** If password is strong enough and email is valid, hash password and create new user */
export const signUp = async (req: Request, res: Response) => {
    const validator = new Validation()
    const email: string = req.body.email
    const password: string = req.body.password

    try {
        validator.email(email)
        validator.password(password)

        const hashKey = await bcrypt.hash(password, 10)

        await database.createUser(email, hashKey)

        res.status(201).json({ message: 'Utilisateur créé' })
    } catch (error) {
        res.status(400).json({ error: error || 'Erreur Serveur' })
    }
}


// Try to find user, then check if password is correct, then create and send token
export const login = async (req: Request, res: Response) => {
    try {
        const email: string = req.body.email
        const password: string = req.body.password

        const findedUser = await database.loginUser(email)

        const passwordIsValid = await bcrypt.compare(password, findedUser.password)
        if (!passwordIsValid) {
            throw 'Mot de passe incorrect'
        }
        res.status(200).json({
            userId: findedUser._id,
            token: jwt.sign(
                { userId: findedUser._id },
                (process.env.KEY as string),
                { expiresIn: '24h' }
            )
        })
    } catch (error) {
        res.status(401).json({ error: error || 'Erreur serveur' })
    }
}

