/** Import Dependancies */
import http from 'http'
import { AppManager } from './app'
import sauceRouter from './routes/sauce-routes'
import userRouter from './routes/user-routes'
import mongoose from 'mongoose'


const MONGO_URI: string | undefined = process.env.LOG
const PORT: string | undefined = process.env.PORT


class Server {

    server: http.Server
    app: AppManager

    constructor() {
        if (MONGO_URI === undefined) {
            throw new Error("You must specify mongo uri");
        }
        if (PORT === undefined) {
            throw new Error("You must specify PORT");
        }
        this.app = new AppManager(MONGO_URI, parseInt(PORT))

        this.app.setRouter(sauceRouter, userRouter)
        this.app.setDB(mongoose)
        this.app.init()

        //Create HTTP Server
        this.server = http.createServer(this.app.getExpress())



        // Server listeners
        this.server.on('error', this.onError)
        this.server.on('listening', this.onListening)

    }

    start(): void {
        this.server.listen(this.app.getPort())
        console.log('Starting server...')
    }


    private onListening(): void {
        const addr = mainServer.server.address()
        const bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port
        console.log('Listening on ' + bind)
    }

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') {
            throw error
        }
        const address = this.server.address()
        const bind = typeof address === 'string'
            ? 'pipe ' + address
            : 'port: ' + this.app.getPort()

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges.')
                process.exit(1)
                break
            case 'EADDRINUSE':
                console.error(bind + ' is already in use.')
                process.exit(1)
                break
            default:
                throw error
        }
    }
}


const mainServer = new Server()

mainServer.start()
