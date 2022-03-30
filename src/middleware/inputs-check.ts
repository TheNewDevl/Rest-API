import { NextFunction, Request, Response } from 'express'

// Temporary validators, in a future version a module will be used to validate all data

const heatChecker = (heat: number): boolean => {
    return typeof heat === 'number' && heat >= 0 && heat <= 10
}
const nameChecker = (name: string): boolean => {
    return /^([a-zA-Zéàè@êûâç'"-][\s]{0,10}){3,30}$/gm.test(name) && typeof name === 'string'
}
const manufacturerChecker = (manufacturer: string): boolean => {
    return /^([a-zA-Zéàè@êûâç'"-][\s]{0,10}){3,30}$/gm.test(manufacturer) && typeof manufacturer === 'string'
}
const descriptionChecker = (description: string): boolean => {
    return /^([a-zA-Zéàè@êûâç'"-][\s]{0,10}){3,30}$/gm.test(description) && typeof description === 'string'
}
const mainPepperChecker = (mainPepper: string): boolean => {
    return /^([a-zA-Zéàè@êûâç'"-][\s]{0,10}){3,30}$/gm.test(mainPepper) && typeof mainPepper === 'string'
}

export default (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!heatChecker(req.body.heat)) {
            throw 'Doit être un chiffre entre 0 et 10'
        } else if (!nameChecker(req.body.name)) {
            throw 'Des caractères interdits ont été utilisés'
        } else if (!manufacturerChecker(req.body.manufacturer)) {
            throw 'Des caractères interdits ont été utilisés'
        } else if (!descriptionChecker(req.body.description)) {
            throw 'Des caractères interdits ont été utilisés'
        } else if (!mainPepperChecker(req.body.mainPepper)) {
            throw 'Des caractères interdits ont été utilisés'
        } else {
            next()
        }
    } catch (error) {
        res.status(400).json({ error })
    }
}
