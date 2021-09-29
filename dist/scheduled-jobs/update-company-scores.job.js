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
exports.UpdateCompanyScoresJob = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const sfgp_service_1 = require("../services/sfgp.service");
let UpdateCompanyScoresJob = class UpdateCompanyScoresJob {
    constructor(sfgpService) {
        this.sfgpService = sfgpService;
    }
    async run() {
        await this.sfgpService.updateScores();
    }
};
__decorate([
    schedule_1.Cron(schedule_1.CronExpression.EVERY_DAY_AT_1AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UpdateCompanyScoresJob.prototype, "run", null);
UpdateCompanyScoresJob = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [sfgp_service_1.SfgpService])
], UpdateCompanyScoresJob);
exports.UpdateCompanyScoresJob = UpdateCompanyScoresJob;
//# sourceMappingURL=update-company-scores.job.js.map