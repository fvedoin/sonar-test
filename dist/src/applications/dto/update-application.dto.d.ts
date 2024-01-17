import { CreateApplicationDto } from './create-application.dto';
declare const UpdateApplicationDto_base: import("@nestjs/common").Type<Partial<CreateApplicationDto>>;
export declare class UpdateApplicationDto extends UpdateApplicationDto_base {
    name: string;
    description: string;
    clientId: string;
}
export {};
