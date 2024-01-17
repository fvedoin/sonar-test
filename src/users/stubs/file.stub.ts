import { Readable } from 'stream';

export const fileStub = (): Express.Multer.File => {
  return {
    originalname: 'file.png',
    mimetype: 'image.png',
    path: 'something',
    buffer: Buffer.from('one,two,three'),
    fieldname: '',
    encoding: '',
    size: 0,
    stream: new Readable(),
    destination: '',
    filename: '',
  };
};

export const getFileStub = () => {
  return Buffer.from('some data');
};
