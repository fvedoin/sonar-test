import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { cnpj } from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'CNPJValidator', async: false })
export class CNPJValidator implements ValidatorConstraintInterface {
  validate(CNPJ: string) {
    return cnpj.isValid(CNPJ);
  }

  defaultMessage() {
    return 'It is not a valid cnpj';
  }
}
