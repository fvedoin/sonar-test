import { Types } from 'mongoose';
export declare class CreateClientDto {
    name: string;
    initials: string;
    cnpj: string;
    aneelcode?: string;
    local: string;
    address: string;
    modules: string[];
    parentId?: Types.ObjectId | string;
    active?: boolean;
}
