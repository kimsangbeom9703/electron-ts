#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app';
import debug from 'debug';
import {Server} from 'http';
import https from 'https';
import fs from 'fs';
// import { HttpError } from 'http-errors';

/**
 * Get port from environment and store in Express.
 */

const port: string | number = normalizePort(process.env.PORT || '443');
app.set('port', port);

/**
 * Create HTTP server.
 */
const options = {
  key: fs.readFileSync('./ssl/localhost-key.pem'),
  cert: fs.readFileSync('./ssl/localhost-cert.pem')
};
const server: Server = https.createServer(options,app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string | number): string | number {
    const parsedPort: number = parseInt(val.toString(), 10);

    if (Number.isNaN(parsedPort)) {
        // named pipe or invalid value, return it as string
        return val.toString();
    }

    if (parsedPort >= 0) {
        // valid port number
        return parsedPort;
    }

    return val.toString(); // fallback to returning as string
}


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind: string = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(): void {
    const addr = server.address();
    const bind: string = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr?.port;
    debug('Listening on ' + bind);
}
