import { EventEmitter2 } from 'eventemitter2';
export declare class EventService {
    private readonly eventEmitter;
    constructor(eventEmitter: EventEmitter2);
    fetchScore(domain: string): void;
}
