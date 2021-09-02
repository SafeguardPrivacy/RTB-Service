import {Injectable, Scope} from '@nestjs/common';
import * as WinstonTransport from 'winston-transport';
import winston = require('winston');
import {createLogger, LoggerOptions} from 'winston';
import {format} from 'logform';

@Injectable({scope: Scope.TRANSIENT})
export class LoggerService {
    private readonly logger: winston.Logger;
    private readonly options: LoggerOptions;

    constructor() {
        this.options = {
            level: 'debug',
            format: winston.format.combine(
                format.errors({stack: true}),
                format.json(),
                winston.format.timestamp({format: 'MM/DD/YYYY hh:mm:ss.SSS'}),
                // winston.format.colorize(),
                winston.format.splat(),
                winston.format.prettyPrint(),
                winston.format.printf((info) => {
                    return `${info.timestamp} [${info.level}] : ${info.message}`;
                }),
            ),
            transports: LoggerService.getWinstonTransports(),
        };

        this.logger = createLogger(this.options);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info(message: string, ...meta: any[]): void {
        this.logger.info(`${message} %j`, meta);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log(message: string, ...meta: any[]): void {
        this.logger.debug(`${message} %j`, meta);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error(message: string, ...meta: any[]): void {
        if (!message) {
            return;
        }

        this.logger.error(message);

        if (meta.length) {
            // If metadata contains exception
            if (meta.includes('ExceptionsHandler')) {
                this.logger.verbose(meta[0]);

                const error = new Error(message);
                error.stack = meta[0];
            } else {
                this.logger.verbose(`%j`, meta);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn(message: string, ...meta: any[]): void {
        this.logger.warn(`${message} %j`, meta);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    verbose(message: string, ...meta: any[]): void {
        this.logger.verbose(`${message} %j`, meta);
    }

    private static getWinstonTransports(): WinstonTransport[] | undefined {
        const transports: WinstonTransport[] = [new winston.transports.Console()];
        return transports;
    }
}
