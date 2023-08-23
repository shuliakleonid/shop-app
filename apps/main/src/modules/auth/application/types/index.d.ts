import { SessionDto } from '../../modules/sessions/application/dto/SessionDto';

declare global {
  declare namespace Express {
    export interface Request {
      customerId: number;
      sessionData: SessionDto;
    }
  }
}
