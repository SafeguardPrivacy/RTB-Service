import {ApiProperty} from '@nestjs/swagger';

export class GetScoreResponse {
    constructor(domain: string, score: number, audited: number, message = '') {
        this.domain = domain;
        this.score = score;
        this.audited = audited;
        this.message = message;
    }

    @ApiProperty({ description: 'The domain of the customer' })
    public domain: string;

    @ApiProperty({ description: 'The customer\'s compliance score' })
    public score: number;

    @ApiProperty({ description: 'Customer\'s audit status' })
    public audited: number;

    @ApiProperty({ description: 'Notification message about customer' })
    public message: string;
}
