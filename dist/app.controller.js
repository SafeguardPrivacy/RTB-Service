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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const sfgp_service_1 = require("./services/sfgp.service");
const redis_service_1 = require("./services/redis.service");
const get_score_response_1 = require("./responses/get-score.response");
const swagger_1 = require("@nestjs/swagger");
const event_service_1 = require("./services/event.service");
const api_implicit_query_decorator_1 = require("@nestjs/swagger/dist/decorators/api-implicit-query.decorator");
let AppController = class AppController {
    constructor(sfgpService, redisService, eventService) {
        this.sfgpService = sfgpService;
        this.redisService = redisService;
        this.eventService = eventService;
        this.redisService.flushAll();
    }
    async getScore(domain, law) {
        if (!domain) {
            throw new common_1.HttpException('domain is required', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (!law) {
            throw new common_1.HttpException('law is required', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (await this.redisService.domainExists(domain)) {
            const key = this.redisService.formatKey(law, domain);
            const auditKey = this.redisService.formatKey(law, domain, true);
            const score = await this.redisService.get(key);
            const audited = await this.redisService.get(auditKey);
            if (score === null) {
                throw new common_1.HttpException('not_found', common_1.HttpStatus.NOT_FOUND);
            }
            else {
                return new get_score_response_1.GetScoreResponse(domain, +score, +audited);
            }
        }
        else {
            await this.redisService.addDomain(domain);
            this.eventService.fetchScore(domain);
            throw new common_1.HttpException('no_cache', common_1.HttpStatus.NOT_FOUND);
        }
    }
};
__decorate([
    common_1.Get(),
    swagger_1.ApiOperation({ summary: 'Get a pass/fail score of a customer\'s SafeguardPrivacy score' }),
    swagger_1.ApiResponse({ status: common_1.HttpStatus.OK, type: get_score_response_1.GetScoreResponse }),
    swagger_1.ApiResponse({ status: common_1.HttpStatus.UNPROCESSABLE_ENTITY }),
    api_implicit_query_decorator_1.ApiImplicitQuery({
        name: 'domain',
        description: 'The domain of the customer you want to check'
    }),
    api_implicit_query_decorator_1.ApiImplicitQuery({
        name: 'law',
        description: 'The law you want to check'
    }),
    __param(0, common_1.Query('domain')),
    __param(1, common_1.Query('law')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getScore", null);
AppController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [sfgp_service_1.SfgpService,
        redis_service_1.RedisService,
        event_service_1.EventService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map