"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.file = void 0;
const stream_1 = require("stream");
const file = () => {
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
exports.file = file;
//# sourceMappingURL=file.stub.js.map