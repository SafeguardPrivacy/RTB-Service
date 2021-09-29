import { SfgpService } from '../services/sfgp.service';
export declare class UpdateCompanyScoresJob {
    private sfgpService;
    constructor(sfgpService: SfgpService);
    run(): Promise<void>;
}
