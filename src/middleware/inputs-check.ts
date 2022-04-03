import { NextFunction, Request, Response } from 'express'
import { Validation } from '../utils/validation'
import fs from 'fs'

const validation = new Validation()

// Temporary validators, in a future version a module will be used to validate all data

export default (req: Request, res: Response, next: NextFunction) => {

    try {
        const sauce = req.file
            ? JSON.parse(req.body.sauce)
            : req.body
        validation.heat(sauce.heat)
        validation.name(sauce.name)
        validation.manufacturer(sauce.manufacturer)
        validation.description(sauce.description)
        validation.mainpepper(sauce.mainPepper)

        next()

    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.log(err)
                }
                console.log('image unlinked')
                res.status(400).json({ error })
            })
        }
        res.status(400).json({ error })
    }
}
