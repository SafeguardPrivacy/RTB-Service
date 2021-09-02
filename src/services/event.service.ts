import {Injectable} from '@nestjs/common';
import {EventEmitter2} from 'eventemitter2';
import {FetchScoreEvent} from '../events/fetch-score.event';

@Injectable()
export class EventService {

    constructor(
        private readonly eventEmitter: EventEmitter2,
    ) {}

    fetchScore(domain: string): void {
        const evt = new FetchScoreEvent();
        evt.domain = domain;

        this.eventEmitter.emit('score.fetch', evt);
    }

}
