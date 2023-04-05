import { Observable, of } from 'rxjs';
import { AuthLoginStrategy } from './login.strategy';

export class DefaultAuthLoginStrategy implements AuthLoginStrategy {
  login(): Observable<void> {
    return of(undefined);
  }
}
