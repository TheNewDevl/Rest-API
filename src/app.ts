// Import Express
import express, { Router, Express, Request, Response } from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'

export interface AppRouterInterface {
    uri: string
    router: Router
}

export class AppManager {

    private app: Express | null = null
    private routerList: AppRouterInterface[] = []
    private port: number

    constructor(port: number = 3000) {
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

        // 404 status for all routes not found
        this.app.use((req: Request, res: Response) => {
            res.status(404).send('Page not found')
        })

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




