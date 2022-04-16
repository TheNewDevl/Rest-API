import { NextFunction, Response } from 'express'
import * as database from '../database/sauce.database'
/** 
 * Check if the userID corresponds with Sauce user Id
 * prevent deletion or uptade by someone else
 */
export default async (req: any, res: Response, next: NextFunction) => {
    try {
        const sauceId = req.params.id
        const dbSauce = await database.findOne(sauceId)
        if (dbSauce.userId !== req.auth.userId) {
            throw 'Vous n\'avez pas le droit de modifier cette sauce... :( '
        }
        next()
    } catch (error) {
        res.status(401).json({ error })
    }
}
