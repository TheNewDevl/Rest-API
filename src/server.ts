/** Import Dependancies */
import http from 'http'
import { Pipe } from 'stream'
import app, { appManager } from './app'

class Server {

    readonly port: number | string | boolean

    server: http.Server

    constructor() {

        //Create HTTP Server
        this.server = http.createServer(app)

        // Set port
        this.port = this.normalizePort(process.env.PORT || 3000)
        app.set('port', this.port)

        // Server listeners
        this.server.on('error', this.onError)
        this.server.on('listening', this.onListening)

    }

    start(): void {
        this.server.listen(this.port)
        console.log('Starting server...')
    }

    /** Normalize a port into a number, string, or false. */
    private normalizePort(val: any | Pipe): number | string | boolean {
        const port = parseInt(val, 10)
        if (isNaN(port)) {
            // named pipe
            return val
        }
        if (port >= 0) {
            // port number
            return port
        }
        return false
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
            : 'port: ' + this.port

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

appManager()