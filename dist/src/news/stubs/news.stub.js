"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsStub = void 0;
const mongoose_1 = require("mongoose");
const newsStub = () => {
    return {
        _id: new mongoose_1.Types.ObjectId('63c840f1e92e56db70b7c1e8'),
        description: 'teste',
        image: '',
        url: 'teste3',
        title: 'teste4',
    };
};
exports.newsStub = newsStub;
//# sourceMappingURL=news.stub.js.map