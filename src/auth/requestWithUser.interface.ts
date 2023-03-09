import { LoginResult } from './auth.pb';

export interface RequestWithUser extends Request {
  user: LoginResult;
}
