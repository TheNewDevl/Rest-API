import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/User'
import { Request, Response } from 'express'


/** Check if password is strong enough and not contain dangerous characters */
const isPasswordStrongEnough = (password: string): boolean => {
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.;,:_-])[A-Za-z0-9.;,:_-]{8,30}$/gm
    return regexPassword.test(password)
}

/** Check if input email is valid */
const isEmailValid = (email: string): boolean => {
    const regexEmail = /^([a-z0-9]+(?:[._-][a-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})$/i
    return regexEmail.test(email)
}

/** If password is strong enough and email is valid, hash password and create new user */
export const signUp = async (req: Request, res: Response) => {
    if (!isEmailValid(req.body.email)) {
        return res.status(400).json({ error: 'Email invalide !' })
    }
    if (!isPasswordStrongEnough(req.body.password)) {
        return res.status(400).json({ error: 'Mot de passe invalide ! Doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial' })
    }

    try {
        const hashKey = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            email: req.body.email,
            password: hashKey
        })
        await user.save()
        res.status(201).json({ message: 'Utilisateur créé' })
    } catch (error) {
        res.status(400).json({ error })
    }
}

// Try to find user, then check if password is correct, then create and send token
export const login = async (req: Request, res: Response) => {
    try {
        const findedUser = await User.findOne({ email: req.body.email })
        if (!findedUser) {
            throw 'Utilisateur non trouvé'
        }
        const passwordIsValid = await bcrypt.compare(req.body.password, findedUser.password)
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

