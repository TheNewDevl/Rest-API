// Import Express
import express, { Router, Express, Request, Response } from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'

import { Mongoose } from 'mongoose'

export interface AppRouterInterface {
    uri: string
    router: Router
}


export class AppManager {

    private app: Express | null = null
    private dataBase: Mongoose | null = null
    private mongoUri: string
    private routerList: AppRouterInterface[] = []
    private port: number

    constructor(mongoUri: string, port: number = 3000) {
        this.mongoUri = mongoUri
        this.port = port

    }

    init() {

        this.app = express()
        this.app.set('port', this.port)

        // Configure CORS for all routes
        this.app.use(cors())
        // Makes body request exploitable as body parser
        this.app.use(express.json())

        this.app.use('/images', express.static(path.join(__dirname, '../images')))
        for (let route of this.routerList) {
            this.app.use(route.uri, route.router)
        }

        this.dataBase?.connect(this.mongoUri)
            .then(() => console.log('Connected to database'))
            .catch(err => console.log(err))

        // 404 status for all routes not found
        this.app.use((req: Request, res: Response) => {
            res.status(404).send('Page not found')
        })

    }

    setDB(dataBase: Mongoose) {
        this.dataBase = dataBase
    }

    getPort(): number {
        return this.port
    }

    getExpress(): Express {
        if (this.app === null) {
            throw new Error('App is null')
        }
        return this.app
    }

    setRouter(...router: AppRouterInterface[]) {
        this.routerList = router
    }

    setImgDir(): void {
        const dir: string = './images';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
}




