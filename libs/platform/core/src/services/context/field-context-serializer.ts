import { Observable, of } from 'rxjs';
import { ContextSerializer } from './context.service';

export class FieldContextSerializer<
  T extends Record<string, string> = Record<string, string>
> implements ContextSerializer
{
  constructor(protected key: string = 'id') {}

  serialize(value: T): Observable<string> {
    return of(`${value[this.key]}` ?? '');
  }

  deserialize(value: string): Observable<T | undefined> {
    return of(value ? ({ [this.key]: value } as T) : undefined);
  }

  distill?(value: T): Observable<T | undefined> {
    return of(
      value[this.key] ? ({ [this.key]: value[this.key] } as T) : undefined
    );
  }
}
