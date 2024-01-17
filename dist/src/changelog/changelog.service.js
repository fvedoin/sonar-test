"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogsService = void 0;
const common_1 = require("@nestjs/common");
const changelog_repository_1 = require("./changelog.repository");
let ChangelogsService = class ChangelogsService {
    constructor(changelogRepository) {
        this.changelogRepository = changelogRepository;
    }
    create(createChangelogDto) {
        return this.changelogRepository.create(createChangelogDto);
    }
    findAll() {
        return this.changelogRepository.find({});
    }
    findOne(id) {
        return this.changelogRepository.findOne({ _id: id });
    }
    update(id, updateChangelogDto) {
        return this.changelogRepository.findOneAndUpdate({ _id: id }, updateChangelogDto);
    }
    remove(id) {
        return this.changelogRepository.delete(id);
    }
};
ChangelogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [changelog_repository_1.ChangelogsRepository])
], ChangelogsService);
exports.ChangelogsService = ChangelogsService;
//# sourceMappingURL=changelog.service.js.map