import { diskStorage } from 'multer';
import { resolve } from 'path';
import { randomBytes } from 'crypto';

export default {
  storage: diskStorage({
    destination: resolve(__dirname, '..', 'uploads', 'images'),
    filename(_, file, callback) {
      const hash = randomBytes(6).toString('hex');
      const fileName = `${hash}-${file.originalname}`;
      callback(null, fileName);
    },
  }),
};
