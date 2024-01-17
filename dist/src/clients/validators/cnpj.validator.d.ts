import { ValidatorConstraintInterface } from 'class-validator';
export declare class CNPJValidator implements ValidatorConstraintInterface {
    validate(CNPJ: string): boolean;
    defaultMessage(): string;
}
