import { NextFunction, Request, Response } from "express";
import Sauce from "../models/Sauce";
import fs from 'fs'

/** Create a new Sauce In DataBase  */
export const createSauce = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // check if file property exists
        if (!req.file) {
            throw 'Aucun fichier n\'a été envoyé'
        }

        // parse the request body to a JSON object
        const parsedBody = JSON.parse(req.body.sauce)

        delete parsedBody._id

        // Instantiate a new sauce usins the parsed body properties and the file for imageUrl
        const sauce = new Sauce({
            ...parsedBody,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        })

        // save the new sauce in the database
        const newSauce = await sauce.save()
        res.status(201).json({ message: 'Sauce enregistrée' + newSauce })
    } catch (error) {
        res.status(400).json({ error })
    }
}

/** Get all sauces drom DB */
export const getAllSauces = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sauces = await Sauce.find()
        res.status(200).json(sauces)
    } catch (error) {
        res.status(400).json({ error })
    }
}

/** Get one sauce from DB */
export const getOneSauce = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id })
        if (!sauce) {
            throw 'Sauce non trouvée'
        }
        res.status(200).json(sauce)
    } catch (error) {
        res.status(400).json({ message: 'Sauce non trouvée', error })
    }
}

/** Update one Sauce if exists with or without new file */
export const modifySauce = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Parse the request body to a JSON object if contains file property
        const sauceData = req.file
            ? {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : { ...req.body }

        // update the sauce in the database using the sauce id and the new sauce data
        const updatedSauce = await Sauce.updateOne({ _id: req.params.id }, { ...sauceData, _id: req.params.id })
        res.status(200).json({ message: 'Sauce modifiée' + updatedSauce })
    } catch (error) {
        res.status(400).json({ error })
    }
}

/** Allow user to delete their own sauce */
export const deleteSauce = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Find the sauce in DB to use the url to delete the image
        const sauceToDelete = await Sauce.findOne({ _id: req.params.id })

        // Using unlink method from fs module to delete file in server and use the callback function to check if the file has been deleted
        const filename = sauceToDelete.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, async () => {
            await Sauce.deleteOne({ _id: req.params.id })
        })

        res.status(200).json({ message: 'Sauce supprimée' })
    } catch (error) {
        res.status(500).json({ error })
    }
}

/** Check if input is a number and only accepts -1,0,1  */
const isLikeValidNumber = (likeNumber: number): boolean => {
    return likeNumber >= -1 && likeNumber <= 1 && typeof likeNumber === 'number'
}
/** Return true if usersLiked[] ou usersDisliked[] contain userId  */
const alreadyLikeOrDisliked = (sauce: any, userId: String): boolean => {
    return sauce.usersLiked.includes(userId) || sauce.usersDisliked.includes(userId)
}

/** Puts the like and the userId in the right place checking all possibilities */
export const likeManagement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!isLikeValidNumber(req.body.like)) {
            throw 'Le like doit être un nombre compris entre -1 et 1'
        }
        const userId = req.body.userId

        // Retrieve the sauce from DB
        const sauceToUpdate = await Sauce.findOne({ _id: req.params.id })
        switch (req.body.like) {
            case 0:
                if (sauceToUpdate.usersLiked.includes(req.body.userId)) {
                    await Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                } else if (sauceToUpdate.usersDisliked.includes(req.body.userId)) {
                    await Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                } else {
                    throw 'Vous n\'avez pas encore donné votre avis sur cette sauce !'
                }
                break;
            case 1:
                if (alreadyLikeOrDisliked(sauceToUpdate, userId)) {
                    throw 'Vous avez déjà donné votre avis sur cette sauce !'
                } else {
                    await Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: +1 }, $push: { usersLiked: userId } })
                }
                break
            case -1:
                if (alreadyLikeOrDisliked(sauceToUpdate, userId)) {
                    throw 'Vous avez déjà donné votre avis sur cette sauce !'
                } else {
                    await Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: userId } })
                }
                break;
        }
        res.status(201).json({ message: 'Votre avis a été enregistré !' })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}