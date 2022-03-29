import { NextFunction, Request, Response } from "express";
import Sauce from "../models/Sauce";

export const getAllSauces = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}
