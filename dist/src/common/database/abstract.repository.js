"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
class AbstractRepository {
    constructor(model, connection) {
        this.model = model;
        this.connection = connection;
    }
    async create(document, options) {
        const createdDocument = new this.model({
            ...document,
            _id: new mongoose_1.Types.ObjectId(),
        });
        return (await createdDocument.save(options)).toJSON();
    }
    async findOne(filterQuery, projection = {}) {
        const document = await this.model.findOne(filterQuery, projection, {
            lean: true,
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found.');
        }
        return document;
    }
    async findOneAndUpdate(filterQuery, update) {
        const document = await this.model.findOneAndUpdate(filterQuery, update, {
            lean: true,
            new: true,
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found.');
        }
        return document;
    }
    async upsert(filterQuery, document) {
        return this.model.findOneAndUpdate(filterQuery, document, {
            lean: true,
            upsert: true,
            new: true,
        });
    }
    async find(filterQuery, projection = {}) {
        return this.model.find(filterQuery, projection, { lean: true });
    }
    async delete(id) {
        await this.model.findByIdAndDelete(id);
    }
    async startTransaction() {
        const session = await this.connection.startSession();
        session.startTransaction();
        return session;
    }
}
exports.AbstractRepository = AbstractRepository;
//# sourceMappingURL=abstract.repository.js.map