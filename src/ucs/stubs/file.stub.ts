import { Readable } from 'stream';
import { csvFileStub } from './csvFile.stub';

export const file = (): Express.Multer.File => {
  return {
    originalname: 'file.png',
    mimetype: 'image.png',
    path: 'something',
    buffer: Buffer.from(csvFileStub()),
    fieldname: '',
    encoding: '',
    size: 0,
    stream: new Readable(),
    destination: '',
    filename: '',
  };
};
