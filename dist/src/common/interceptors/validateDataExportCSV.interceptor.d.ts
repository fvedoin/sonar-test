import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class ValidateDataExportCSV implements NestInterceptor {
    private isQueryValid;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
