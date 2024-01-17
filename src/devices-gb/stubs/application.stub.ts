import { Types } from 'mongoose';
import { Application } from 'src/applications/entities/application.entity';

export const applicationStubs = (
  _id: Types.ObjectId,
  dto?: Partial<Application>,
) => ({
  _id,
  clientId: '64de077bd89e32004e59fb37',
  appId: 'qnponwwwwstv6khs',
  name: 'Application Teste',
  token:
    '716e706dasw7776e34397476366b68733a4170706c69636174696f6e2054656c656d656469c3a7c3a36f20477275706f2042',
  description: '',
  ...dto,
});
