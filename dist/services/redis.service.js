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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const redis = require("redis");
const util_1 = require("util");
const redis_config_1 = require("../config/redis.config");
const threshold_service_1 = require("./threshold.service");
let RedisService = class RedisService {
    constructor(thresholdService) {
        this.thresholdService = thresholdService;
        this.keyPrefix = process.env.REDIS_KEY_PREFIX || '';
        this.domainList = 'company_domains';
        try {
            this.client = redis.createClient(redis_config_1.RedisConfig);
            this.getAsync = util_1.promisify(this.client.get).bind(this.client);
            this.setAsync = util_1.promisify(this.client.set).bind(this.client);
            this.saddAsync = util_1.promisify(this.client.sadd).bind(this.client);
            this.smembersAsync = util_1.promisify(this.client.smembers).bind(this.client);
            this.sismemberAsync = util_1.promisify(this.client.sismember).bind(this.client);
            this.flushallAsync = util_1.promisify(this.client.flushall).bind(this.client);
        }
        catch (e) {
            throw new Error(e);
        }
    }
    async flushAll() {
        return this.flushallAsync();
    }
    async getDomainList() {
        const prefixedDLKey = this.getPrefixedKey(this.domainList);
        return this.smembersAsync(prefixedDLKey);
    }
    async domainExists(domain) {
        const prefixedDLKey = this.getPrefixedKey(this.domainList);
        const isMember = await this.sismemberAsync(prefixedDLKey, domain);
        return isMember === 1;
    }
    async addDomain(domain) {
        const prefixedDLKey = this.getPrefixedKey(this.domainList);
        await this.saddAsync(prefixedDLKey, domain);
    }
    formatKey(law, domain, auditKey = false) {
        return `${law}_${domain}${auditKey ? '_audit' : ''}`;
    }
    async set(key, value, expire) {
        const prefixedKey = this.getPrefixedKey(key);
        try {
            if (expire) {
                await this.setAsync(prefixedKey, value, 'EX', expire);
            }
            else {
                await this.setAsync(prefixedKey, value);
            }
            return true;
        }
        catch (e) {
            return false;
        }
    }
    async get(key) {
        const prefixedKey = this.getPrefixedKey(key);
        if (prefixedKey) {
            return this.getAsync(prefixedKey);
        }
        return Promise.resolve('');
    }
    getPrefixedKey(key) {
        return key ? this.keyPrefix + key : '';
    }
};
RedisService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [threshold_service_1.ThresholdService])
], RedisService);
exports.RedisService = RedisService;
//# sourceMappingURL=redis.service.js.map