import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';


//TODO ERROR REQ.AUTH add property
export default (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check if contains Authorization header
        if (!req.headers.authorization) {
            throw 'Outil d\'identification absent !'
        } else {
            const token = req.headers.authorization.split(' ')[1];

            // Decode token using secret key 
            const decodedToken: any = jwt.verify(token, process.env.KEY as string) // TS error La propriété 'auth' n'existe pas sur le type 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>

            const userId: string = decodedToken.userId;

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
        res.status(401).json({ error: error || 'Requête non authentifiée !' })
    }
}
