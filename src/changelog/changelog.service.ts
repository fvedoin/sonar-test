import { Injectable } from '@nestjs/common';

import { ChangelogsRepository } from './changelog.repository';
import { CreateChangelogDto } from './dto/create-changelogs.dto';
import { UpdateChangelogDto } from './dto/update-changelogs.dto';

@Injectable()
export class ChangelogsService {
  constructor(private readonly changelogRepository: ChangelogsRepository) {}

  create(createChangelogDto: CreateChangelogDto) {
    return this.changelogRepository.create(createChangelogDto);
  }

  findAll() {
    return this.changelogRepository.find({});
  }

  findOne(id: string) {
    return this.changelogRepository.findOne({ _id: id });
  }

  update(id: string, updateChangelogDto: UpdateChangelogDto) {
    return this.changelogRepository.findOneAndUpdate(
      { _id: id },
      updateChangelogDto,
    );
  }

  remove(id: string) {
    return this.changelogRepository.delete(id);
  }
}
