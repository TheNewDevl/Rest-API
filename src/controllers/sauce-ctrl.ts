import { NextFunction, Request, Response } from "express";
import Sauce from "../models/Sauce";

// Get all sauces drom DB
export const getAllSauces = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sauces = await Sauce.find()
        res.status(200).json(sauces)
    } catch (error) {
        res.status(400).json({ error })
    }
}

// Get one sauce from DB
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

