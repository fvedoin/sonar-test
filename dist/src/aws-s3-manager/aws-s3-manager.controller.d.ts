import { AwsS3ManagerService } from './aws-s3-manager.service';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
export declare class AwsS3ManagerController {
    private readonly s3Service;
    constructor(s3Service: AwsS3ManagerService);
    getFile(key: string): Promise<string>;
    getFiles(user: UserFromJwt): Promise<import("@aws-sdk/client-s3")._Object[]>;
}
