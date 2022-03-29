/** Import Dependancies */
import http from 'http';
import app, { appRoutes } from './app';

/** Normalize a port into a number, string, or false. */
function normalizePort(val: any): number | string | boolean {
    let port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

function onListening(): void {
    const addr = mainServer.server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : `port ` + addr.port;
    console.log('Listening on ' + bind);
}

class Server {

    readonly port: number | string | boolean;

    server: http.Server;

    constructor() {

        //Create HTTP Server
        this.server = http.createServer(app)

        // Get port from env and store in Express
        this.port = normalizePort(process.env.PORT || 3000);
        app.set('port', this.port);

        // Init methods
        this.start()
        this.routes()
    }

    private start(): void {
        this.server.listen(this.port);
        this.server.on('error', this.onError);
        this.server.on('listening', onListening);
        console.log('Starting server...');
    }

    private routes(): void {
        appRoutes();
    }

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') {
            throw error;
        }
        const address = this.server.address();
        const bind = typeof address === 'string'
            ? 'pipe ' + address
            : 'port: ' + this.port;
        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges.');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use.');
                process.exit(1);
                break;
            default:
                throw error;
        }
    };
}

const mainServer = new Server()

