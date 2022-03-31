import { NextFunction, Request, Response } from 'express'

import fs from 'fs'
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
        const sauce = req.file
            ? JSON.parse(req.body.sauce)
            : req.body
        if (!heatChecker(sauce.heat)) {
            throw 'Doit être un chiffre entre 0 et 10'
        } else if (!nameChecker(sauce.name)) {
            throw 'Doit être un nom de sauce valide'
        } else if (!manufacturerChecker(sauce.manufacturer)) {
            throw 'Doit être un nom de fabriquant valide'
        } else if (!descriptionChecker(sauce.description)) {
            throw 'Doit être une description valide'
        } else if (!mainPepperChecker(sauce.mainPepper)) {
            throw 'Doit être un nom de piment principal valide'
        } else {
            next()
        }
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.log(err)
                }
                console.log('image unlinked');
            })
        }
        res.status(400).json({ error })
    }
}
