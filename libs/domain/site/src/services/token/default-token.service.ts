import { Observable, of, throwError } from 'rxjs';
import { TokenService } from './token.service';

export class DefaultTokenService implements TokenService {
  resolve(token: string): Observable<string | undefined> {
    return of('')
  }
}
