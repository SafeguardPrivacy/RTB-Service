import {Injectable} from '@nestjs/common';
import * as redis from 'redis';
import {promisify} from 'util';
import {RedisConfig} from '../config/redis.config';
import {ThresholdService} from './threshold.service';

@Injectable()
export class RedisService {
    private readonly keyPrefix = process.env.REDIS_KEY_PREFIX || '';
    private readonly client;
    private readonly getAsync;
    private readonly setAsync;
    private readonly saddAsync;
    private readonly smembersAsync;
    private readonly sismemberAsync;

    // TODO: remove
    private readonly flushallAsync;

    private readonly domainList = 'company_domains';

    public constructor(private thresholdService: ThresholdService) {
        try {
            this.client = redis.createClient(RedisConfig);
            this.getAsync = promisify(this.client.get).bind(this.client);
            this.setAsync = promisify(this.client.set).bind(this.client);
            this.saddAsync = promisify(this.client.sadd).bind(this.client);
            this.smembersAsync = promisify(this.client.smembers).bind(this.client);
            this.sismemberAsync = promisify(this.client.sismember).bind(this.client);
            this.flushallAsync = promisify(this.client.flushall).bind(this.client);
        } catch (e) {
            throw new Error(e);
        }
    }

    public async flushAll(): Promise<void> {
        return this.flushallAsync();
    }

    public async getDomainList(): Promise<string[]> {
        const prefixedDLKey = this.getPrefixedKey(this.domainList);
        return this.smembersAsync(prefixedDLKey);
    }

    public async domainExists(domain: string): Promise<boolean> {
        const prefixedDLKey = this.getPrefixedKey(this.domainList);
        const isMember = await this.sismemberAsync(prefixedDLKey, domain);
        return isMember === 1;
    }

    public async addDomain(domain: string): Promise<void> {
        const prefixedDLKey = this.getPrefixedKey(this.domainList);
        await this.saddAsync(prefixedDLKey, domain);
    }

    public formatKey(law: number, domain: string, auditKey = false): string {
        return `${law}_${domain}${auditKey ? '_audit' : ''}`;
    }

    public async set(key: string, value: string, expire?: number): Promise<boolean> {
        const prefixedKey = this.getPrefixedKey(key);

        try {
            if (expire) {
                await this.setAsync(prefixedKey, value, 'EX', expire);
            } else {
                await this.setAsync(prefixedKey, value);
            }

            return true;
        } catch (e) {
            return false;
        }
    }

    public async get(key: string): Promise<string> {
        const prefixedKey = this.getPrefixedKey(key);
        if (prefixedKey) {
            return this.getAsync(prefixedKey);
        }
        return Promise.resolve('');
    }

    private getPrefixedKey(key: string): string {
        return key ? this.keyPrefix + key : '';
    }
}
