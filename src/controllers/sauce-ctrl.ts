import { NextFunction, Request, Response } from "express";
import Sauce from "../models/Sauce";

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
            throw 'Image non trouvée'
        }
        // parse the request body to a JSON object
        const parsedBody = JSON.parse(req.body.sauce)

        // Instantiate a new sauce usins the parsed body properties and the file for imageUrl
        const sauce = new Sauce({
            ...parsedBody,
            imageUrl: `${req.protocol}://${req.get('host')}/dist/images/${req.file.filename}`
        })

        // save the new sauce in the database
        const newSauce = await sauce.save()
        res.status(201).json({ message: 'Sauce enregistrée' + newSauce })
    } catch (error) {
        res.status(400).json({ error })
    }
}


