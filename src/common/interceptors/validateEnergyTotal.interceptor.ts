import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type ISOString = string;

interface RequestBody {
  uc: string[];
  dateRange: {
    startDate: ISOString;
    endDate: ISOString;
  };
  field: string;
}

@Injectable()
export class ValidateEnergyTotal implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { uc: ucs, dateRange, field }: RequestBody = request.query;

    const startDateTime = new Date(dateRange.startDate).getTime();
    const endDateTime = new Date(dateRange.endDate).getTime();

    if (!field) {
      throw new BadRequestException(`Deve ter pelo menos um campo!`);
    }

    if (!ucs.length) {
      throw new BadRequestException(`Deve ser selecionado pelo menos uma UC!`);
    }

    if (endDateTime < startDateTime) {
      throw new BadRequestException(
        `A data final não pode ser menor que a data inicial!`,
      );
    }

    return next.handle().pipe(
      map((data) => {
        return data;
      }),
    );
  }
}
