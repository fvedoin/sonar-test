import { Connection, Model } from 'mongoose';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { Changelog } from './entities/changelogs.entity';
export declare class ChangelogsRepository extends AbstractRepository<Changelog> {
    private changelogModel;
    constructor(changelogModel: Model<Changelog>, connection: Connection);
}
