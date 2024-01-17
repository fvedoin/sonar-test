import { Types } from 'mongoose';

export const notificationStub = (id?: Types.ObjectId) => ({
  _id: id,
  title: 'Notificação teste',
  message: 'Teste test test',
});
