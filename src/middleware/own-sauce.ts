import { NextFunction, Request, Response } from "express";
import Sauce from "../models/Sauce";

/** 
 * Check if the userID corresponds with Sauce user Id
 * prevent deletion by someone else
 */
export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id })
        if (!sauce) {
            throw 'Il y a eu un problème, la sauce n\'a pas été trouvée'
        }
        if (sauce.userId !== req.body.userId) {
            throw 'Vous n\'avez pas le droit de modifier cette sauce... :( '
        }
        next()
    } catch (error) {
        res.status(401).json({ error })
    }
}
