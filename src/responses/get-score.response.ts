import {ApiProperty} from '@nestjs/swagger';

export class GetScoreResponse {
    constructor(domain: string, status: number, message = '') {
        this.domain = domain;
        this.status = status;
        this.message = message;
    }

    @ApiProperty({ description: 'The domain of the customer you checked' })
    public domain: string;

    @ApiProperty({ description: 'If the customer is above or below the threshold, or unknown' })
    public status: number;

    @ApiProperty({ description: 'Notification message about customer' })
    public message: string;
}
