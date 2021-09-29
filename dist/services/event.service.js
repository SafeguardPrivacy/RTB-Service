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
exports.EventService = void 0;
const common_1 = require("@nestjs/common");
const eventemitter2_1 = require("eventemitter2");
const fetch_score_event_1 = require("../events/fetch-score.event");
let EventService = class EventService {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }
    fetchScore(domain) {
        const evt = new fetch_score_event_1.FetchScoreEvent();
        evt.domain = domain;
        this.eventEmitter.emit('score.fetch', evt);
    }
};
EventService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [eventemitter2_1.EventEmitter2])
], EventService);
exports.EventService = EventService;
//# sourceMappingURL=event.service.js.map