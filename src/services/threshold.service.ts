import {Injectable} from '@nestjs/common';

@Injectable()
export class ThresholdService {
    getThreshold(): number {
        return process.env.SFGP_THRESHOLD ? +process.env.SFGP_THRESHOLD : 85;
    }
}
