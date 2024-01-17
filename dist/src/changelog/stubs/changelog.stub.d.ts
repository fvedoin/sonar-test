import { CreateChangelogDto } from '../dto/create-changelogs.dto';
import { Changelog } from '../entities/changelogs.entity';
export declare const createChangeLogWithId: (createChangelogDto: CreateChangelogDto) => Changelog;
