// Import dependancies
import { Request } from 'express'
import multer from 'multer'

type Mimetype = {
    [key: string]: string,
}

const MIME_TYPES: Mimetype = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
}

/** Filter upload files. Only accept the mimetypes in the MIME_TYPES object */
const filterImage = (req: Request, file: Express.Multer.File, cb: CallableFunction) => {
    if (!MIME_TYPES[file.mimetype]) {
        return cb(new Error('Format de fichier non supporté'), false)
    }
    cb(null, true)
}

// Set limits for upload files
const limits = {
    files: 1,
}

// Set storage for upload files
const storage = multer.diskStorage({
    destination: (req, file, fncallback) => {
        fncallback(null, 'images')
    },
    filename: (req: Request, file: Express.Multer.File, fncallback) => {
        const name = file.originalname.split(' ').join('_').replace('.', '')
        const extension = MIME_TYPES[file.mimetype]
        fncallback(null, name + Date.now() + '.' + extension)
    }

})

// Export the multer config as a middleware
export default multer({ storage: storage, fileFilter: filterImage, limits: limits }).single('image')