import { Types } from 'mongoose';
export declare const clientStub: (id: string) => {
    _id: Types.ObjectId;
    active: boolean;
    users: any[];
    name: string;
    local: string;
    address: string;
    initials: string;
    cnpj: string;
    aneelcode: string;
    __v: number;
    modules: string[];
};
