"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileStub = exports.fileStub = void 0;
const stream_1 = require("stream");
const fileStub = () => {
    return {
        originalname: 'file.png',
        mimetype: 'image.png',
        path: 'something',
        buffer: Buffer.from('one,two,three'),
        fieldname: '',
        encoding: '',
        size: 0,
        stream: new stream_1.Readable(),
        destination: '',
        filename: '',
    };
};
exports.fileStub = fileStub;
const getFileStub = () => {
    return Buffer.from('some data');
};
exports.getFileStub = getFileStub;
//# sourceMappingURL=file.stub.js.map