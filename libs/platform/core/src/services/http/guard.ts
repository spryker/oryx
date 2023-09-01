import { Observable } from 'rxjs';

export interface Guard {
  isAllowed(): Observable<boolean>;
}
