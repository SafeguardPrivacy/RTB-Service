"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LoggerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const winston = require("winston");
const winston_1 = require("winston");
const logform_1 = require("logform");
let LoggerService = LoggerService_1 = class LoggerService {
    constructor() {
        this.options = {
            level: 'debug',
            format: winston.format.combine(logform_1.format.errors({ stack: true }), logform_1.format.json(), winston.format.timestamp({ format: 'MM/DD/YYYY hh:mm:ss.SSS' }), winston.format.splat(), winston.format.prettyPrint(), winston.format.printf((info) => {
                return `${info.timestamp} [${info.level}] : ${info.message}`;
            })),
            transports: LoggerService_1.getWinstonTransports(),
        };
        this.logger = winston_1.createLogger(this.options);
    }
    info(message, ...meta) {
        this.logger.info(`${message} %j`, meta);
    }
    log(message, ...meta) {
        this.logger.debug(`${message} %j`, meta);
    }
    error(message, ...meta) {
        if (!message) {
            return;
        }
        this.logger.error(message);
        if (meta.length) {
            if (meta.includes('ExceptionsHandler')) {
                this.logger.verbose(meta[0]);
                const error = new Error(message);
                error.stack = meta[0];
            }
            else {
                this.logger.verbose(`%j`, meta);
            }
        }
    }
    warn(message, ...meta) {
        this.logger.warn(`${message} %j`, meta);
    }
    verbose(message, ...meta) {
        this.logger.verbose(`${message} %j`, meta);
    }
    static getWinstonTransports() {
        const transports = [new winston.transports.Console()];
        return transports;
    }
};
LoggerService = LoggerService_1 = __decorate([
    common_1.Injectable({ scope: common_1.Scope.TRANSIENT }),
    __metadata("design:paramtypes", [])
], LoggerService);
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger.service.js.map