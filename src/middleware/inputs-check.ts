import { NextFunction, Request, Response } from 'express'


const heatChecker = (heat: number): boolean => {
    return typeof heat === 'number' && heat >= 0 && heat <= 10
}

export default (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!heatChecker(req.body.heat)) {
            throw 'Heat must be a number between 0 and 10'
        }


    } catch (error) {
        res.status(400).json({ error })
    }


}



/* 
{
    "_id": "624440cc700962723dc726c7",
        "userId": "6242f314389dcf06a0b53ea3",
            "name": "azazazaz",
                "manufacturer": "zqetzeq",
                    "description": "tqzetzqet",
                        "mainPepper": "qzetq",
                            "imageUrl": "http://localhost:3000/images/Capture_d’écran_2022-02-11_à_10.47.04.png1648640204354.png",
                                "heat": 2,
                                    "likes": 0,
                                        "dislikes": 0,
                                            "usersLiked": [],
                                                "usersDisliked": [],
                                                    "__v": 0
} */