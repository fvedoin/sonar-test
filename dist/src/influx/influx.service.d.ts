import { LastHourDto } from './dto/lastHour.dto';
import { FindQualityDto } from './dto/findQuality.dto';
import { FindFieldsDto } from './dto/findFields.dto';
import { LastHourInflux } from 'src/dashboard/interfaces';
import DataInfluxFindQuality from './interfaces/dataInfluxFindQuality';
import DataInfluxFindFields from './interfaces/dataInfluxFindFields';
import { InfluxRepository } from './influx.repository';
import { GetConsumeDto } from './dto/getConsume.dto';
import { DashboardQualityDto } from './dto/dashboardQuality.dto';
import DataInfluxDashboardQuality from './interfaces/dataInfluxDashboardQuality';
import { FindFaultsDto } from './dto/FindFaults.dto';
import DataInfluxFindFaults from './interfaces/dataInfluxFindFaults';
import { GetAllDataByDevId } from './dto/GetAllData.dto';
import { FindAnalyticsFields } from './dto/FindAnalyticsFields.dto';
export declare class InfluxService {
    private readonly influxRepository;
    constructor(influxRepository: InfluxRepository);
    private getConnection;
    private getQuery;
    lastHour(lastHourDto: LastHourDto): Promise<LastHourInflux[]>;
    findQuality(findQualityDto: FindQualityDto): Promise<DataInfluxFindQuality[]>;
    findFaultsFieldsByUcAndPeriod(findFaultsDto: FindFaultsDto): Promise<DataInfluxFindFaults[]>;
    findAnalyticsFieldData(findAnalyticsDTO: FindAnalyticsFields): Promise<DataInfluxFindFaults[]>;
    dashboardQuality(dashboardQualityDto: DashboardQualityDto): Promise<DataInfluxDashboardQuality[]>;
    findFields(findFieldsDto: FindFieldsDto): Promise<{
        dataResult: DataInfluxFindFields[];
    }>;
    findFieldsCommunication(findFieldsDto: FindFieldsDto): Promise<{
        dataResult: DataInfluxFindFields[];
    }>;
    getConsume(getConsumeDto: GetConsumeDto): Promise<DataInfluxFindFields[]>;
    getAllDataByDevId(data: GetAllDataByDevId): Promise<import("axios").AxiosResponse<any, any>>;
    deleteOldDataByDevId(data: GetAllDataByDevId): Promise<import("axios").AxiosResponse<any, any>>;
    private executeQuery;
}
