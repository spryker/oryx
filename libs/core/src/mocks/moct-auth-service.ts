import { Observable, of } from 'rxjs';
import { AuthService } from '../services';

export class MockAuthService implements Partial<AuthService> {
  isAuthenticated = (): Observable<boolean> => of(false);
}
