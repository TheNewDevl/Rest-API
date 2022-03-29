import { NextFunction, Request, Response } from "express";
import Sauce from "../models/Sauce";
import fs from 'fs'

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

/** Create a new Sauce In DataBase  */
export const createSauce = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // check if file property exists
        if (!req.file) {
            throw 'Aucun fichier n\'a été envoyé'
        }
        // parse the request body to a JSON object
        const parsedBody = JSON.parse(req.body.sauce)

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
/** Update one Sauce if exists with or without new file */
export const modifySauce = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Parse the request body to a JSON object if contains file property
        const sauceData = req.file
            ? {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : { ...req.body }

        // parse the request body to a JSON object
        const parsedBody = JSON.parse(req.body.sauce)

        // update the sauce in the database using the sauce id and the new sauce data
        const updatedSauce = await Sauce.updateOne({ _id: req.params.id }, { ...sauceData, _id: req.params.id })
        res.status(200).json({ message: 'Sauce modifiée' + updatedSauce })
    } catch (error) {
        res.status(400).json({ error })
    }
}

export const deleteSauce = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //Check if the userId sauce corresponds to userId request to prevent deletion by someone else
        const sauceToDelete = await Sauce.findOne({ _id: req.params.id })
        if (!sauceToDelete) {
            throw 'Sauce non trouvée'
        } if (sauceToDelete.uderId !== req.auth._id) {
            throw 'Vous n\'avez pas le droit de supprimer cette sauce'
        }

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