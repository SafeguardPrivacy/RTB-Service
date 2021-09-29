export declare class LoggerService {
    private readonly logger;
    private readonly options;
    constructor();
    info(message: string, ...meta: any[]): void;
    log(message: string, ...meta: any[]): void;
    error(message: string, ...meta: any[]): void;
    warn(message: string, ...meta: any[]): void;
    verbose(message: string, ...meta: any[]): void;
    private static getWinstonTransports;
}
