import { UserDocument } from 'src/modules/v1/users/entities/user.entity';

export enum ResponseStatus {
  SUCCESS = 'success',
  FAIL = 'fail',
}

export class IRequest extends Request {
  user: UserDocument;
}
