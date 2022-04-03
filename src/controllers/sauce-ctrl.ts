import { Request, Response } from 'express'
import Sauce from '../database/models/Sauce'
import * as database from '../database/sauce.database'
import fs from 'fs'
import { Validation } from '../utils/validation'

const validation = new Validation()

/** Create a new Sauce In DataBase  */
export const createSauce = async (req: Request, res: Response) => {
    try {
        // check if file property exists
        if (!req.file) {
            throw 'Aucun fichier n\'a été envoyé'
        }

        // parse the request body to a JSON object
        const parsedBody = JSON.parse(req.body.sauce)
        delete parsedBody._id

        const imgUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

        const newSauce = await database.create(parsedBody, imgUrl)

        res.status(201).json({ message: 'Sauce enregistrée' + newSauce })
    } catch (error) {
        res.status(400).json({ error: error || 'Erreur serveur' })
    }
}

/** Get all sauces drom DB */
export const getAllSauces = async (req: Request, res: Response) => {
    try {
        const sauces = await database.find()
        res.status(200).json(sauces)
    } catch (error) {
        res.status(400).json({ error })
    }
}

/** Get one sauce from DB */
export const getOneSauce = async (req: Request, res: Response) => {
    try {
        const sauceId = req.params.id
        const findedSauce = await database.findOne(sauceId)
        res.status(200).json(findedSauce)
    } catch (error) {
        res.status(400).json({ error: error || 'Erreur serveur' })
    }
}

/** Update one Sauce if exists with or without new file */
export const modifySauce = async (req: Request, res: Response) => {
    try {
        const sauceId = req.params.id

        // If contains file,find the sauce and delete the old image before saving the new one
        if (req.file) {
            const sauce = await database.findOne(sauceId)
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, (err) => {
                if (err) {
                    console.log(err)
                }
            })
        }

        // parse the request body to a JSON object if contains file
        const sauceData = req.file
            ? {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : { ...req.body }

        // update the sauce in the database using the sauce id and the new sauce data
        const updatedSauce = await database.updateOne(sauceId, sauceData)

        res.status(200).json({ message: 'Sauce modifiée' + updatedSauce })
    } catch (error) {
        res.status(400).json({ error: error || 'Erreur serveur' })
    }
}

/** Allow user to delete their own sauce */
export const deleteSauce = async (req: Request, res: Response) => {
    try {
        const sauceId = req.params.id
        // Find the sauce in DB to use the url to delete the image
        const sauceToDelete = await database.findOne(sauceId)

        // Using unlink method from fs module to delete file in server and use the callback function to check if the file has been deleted
        const filename = sauceToDelete.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, async () => {
            await database.deleteOne(sauceId)
        })

        res.status(200).json({ message: 'Sauce supprimée' })
    } catch (error) {
        res.status(500).json({ error: error || 'Erreur serveur' })
    }
}

/** Puts the like and the userId in the right place checking all possibilities */
export const likeManagement = async (req: Request, res: Response) => {
    try {
        const like: number = req.body.like
        const userId: string = req.body.userId
        const sauceId: string = req.params.id

        validation.likeNumber(like)

        const sauceToUpdate = await database.findOne(sauceId)

        switch (like) {
            case 0:
                validation.notLikeOrDislikedYet(sauceToUpdate, userId)
                sauceToUpdate.usersLiked.includes(userId)
                    ? await database.updateLikes(sauceId, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
                    : await database.updateLikes(sauceId, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
                break
            case 1:
                validation.alreadyLikeOrDisliked(sauceToUpdate, userId)
                await database.updateOne(sauceId, { $inc: { likes: +1 }, $push: { usersLiked: userId } })
                break
            case -1:
                validation.alreadyLikeOrDisliked(sauceToUpdate, userId)
                await database.updateLikes(sauceId, { $inc: { dislikes: 1 }, $push: { usersDisliked: userId } })
                break
        }
        res.status(201).json({ message: 'Votre avis a été enregistré !' })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}