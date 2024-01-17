import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const MAX_UCS_90_DAYS = 3;
const MAX_UCS_60_DAYS = 5;
const MAX_UCS_30_DAYS = 10;
const MAX_UCS_1_DAY = 100;

type ISOString = string;

interface RequestBody {
  ucCodes: string[];
  dateRange: {
    startDate: ISOString;
    endDate: ISOString;
  };
  fields: string[];
  communication: Array<'rssi' | 'snr'>;
}
const getMaxDaysByUcs = (ucs) => {
  if (ucs >= 100) {
    return 1;
  } else if (ucs >= 10) {
    return 30;
  } else if (ucs >= 5) {
    return 60;
  } else if (ucs >= 3) {
    return 90;
  }

  return 0; // Se ucs for menor que 3, não há um valor máximo definido.
};

@Injectable()
export class ValidateDataExportCSV implements NestInterceptor {
  private isQueryValid(ucs: number, days: number): boolean {
    if (
      (ucs <= MAX_UCS_90_DAYS && days <= 90) ||
      (ucs <= MAX_UCS_60_DAYS && days <= 60) ||
      (ucs <= MAX_UCS_30_DAYS && days <= 30) ||
      (ucs <= MAX_UCS_1_DAY && days <= 1)
    ) {
      return true;
    } else {
      return false;
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { ucCodes, dateRange, fields, communication }: RequestBody =
      request.body;

    const startDateTime = new Date(dateRange.startDate).getTime();
    const endDateTime = new Date(dateRange.endDate).getTime();

    const dayInMiliseconds = 24 * 60 * 60 * 1000; // 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    const intervalDate = endDateTime - startDateTime;
    const days = intervalDate / dayInMiliseconds;
    const ucs = (ucCodes || []).length;

    if (!fields.length && !communication.length) {
      throw new BadRequestException(
        `Deve ser selecionado pelo menos um campo para gerar o arquivo!`,
      );
    }

    if (!ucs) {
      throw new BadRequestException(`Deve ser selecionado pelo menos uma UC!`);
    }

    if (endDateTime < startDateTime) {
      throw new BadRequestException(
        `A data final não pode ser menor que a data inicial!`,
      );
    }

    // if (!this.isQueryValid(ucs, days)) {
    //   throw new BadRequestException(
    //     `A consulta não pode incluir mais de ${ucs} itens e um tempo maior que ${getMaxDaysByUcs(
    //       ucs,
    //     )} dias!`,
    //   );
    // }

    return next.handle().pipe(
      map((data) => {
        return data;
      }),
    );
  }
}
