import { UserDocument } from 'src/users/entities/user.entity';

export interface AuthRequest extends Request {
  user: UserDocument;
}
