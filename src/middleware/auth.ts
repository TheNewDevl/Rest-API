import { NextFunction, Response } from 'express'
import { verifyToken } from '../utils/jwt'


//TODO ERROR REQ.AUTH add property
export default (req: any, res: Response, next: NextFunction) => {
    try {
        // Check if contains Authorization header
        if (!req.headers.authorization) {
            throw 'Outil d\'identification absent !'
        } else {
            const token = req.headers.authorization.split(' ')[1]

            // Verify Token 
            const decodedToken: any = verifyToken(token)
            const userId: string = decodedToken.userId

            // Store decoded userId in request object to use it in next middlewares
            req.auth = { userId: userId }

            // if req token exsists ans is valid, continue
            if (req.body.userId && req.body.userId !== userId) {
                throw 'User Id non valable !'
            } else {
                next()
            }
        }

    } catch (error) {
        res.status(403).json({ error: error || 'Requête non authentifiée !' })
    }
}
