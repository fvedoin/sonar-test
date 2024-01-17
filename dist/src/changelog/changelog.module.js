"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const changelog_controller_1 = require("./changelog.controller");
const changelog_repository_1 = require("./changelog.repository");
const changelog_service_1 = require("./changelog.service");
const changelogs_entity_1 = require("./entities/changelogs.entity");
let ChangelogsModule = class ChangelogsModule {
};
ChangelogsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: changelogs_entity_1.Changelog.name, schema: changelogs_entity_1.ChangelogSchema },
            ]),
        ],
        controllers: [changelog_controller_1.ChangelogsController],
        providers: [changelog_service_1.ChangelogsService, changelog_repository_1.ChangelogsRepository],
        exports: [changelog_service_1.ChangelogsService],
    })
], ChangelogsModule);
exports.ChangelogsModule = ChangelogsModule;
//# sourceMappingURL=changelog.module.js.map