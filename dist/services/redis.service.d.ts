import { ThresholdService } from './threshold.service';
export declare class RedisService {
    private thresholdService;
    private readonly keyPrefix;
    private readonly client;
    private readonly getAsync;
    private readonly setAsync;
    private readonly saddAsync;
    private readonly smembersAsync;
    private readonly sismemberAsync;
    private readonly flushallAsync;
    private readonly domainList;
    constructor(thresholdService: ThresholdService);
    flushAll(): Promise<void>;
    getDomainList(): Promise<string[]>;
    domainExists(domain: string): Promise<boolean>;
    addDomain(domain: string): Promise<void>;
    formatKey(law: number, domain: string, auditKey?: boolean): string;
    set(key: string, value: string, expire?: number): Promise<boolean>;
    get(key: string): Promise<string>;
    private getPrefixedKey;
}
