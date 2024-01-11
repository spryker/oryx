import { Observable, of } from 'rxjs';
import { ContextSerializer } from './context.service';

export class FieldsContextSerializer<
  T extends Record<string, string> = Record<string, string>
> implements ContextSerializer
{
  constructor(protected keys: string[]) {}

  serialize(value: T): Observable<string> {
    const values = [];
    let lastVal = -1;
    for (let i = 0; i < this.keys.length; i++) {
      const val = value[this.keys[i]];
      values.push(val);
      if (val) {
        lastVal = i;
      }
    }
    return of(lastVal > -1 ? values.slice(0, lastVal + 1).join(',') : '');
  }

  deserialize(value: string): Observable<T | undefined> {
    if (!value) return of(undefined);

    const values = value.split(',');
    const count = Math.min(this.keys.length, values.length);

    const result: Record<string, unknown> = {};
    for (let i = 0; i < count; i++) {
      result[this.keys[i]] = values[i];
    }

    return of(result as T);
  }

  distill?(value: T): Observable<T | undefined> {
    const result: Record<string, unknown> = {};

    for (let i = 0; i < this.keys.length; i++) {
      if (value[this.keys[i]]) {
        result[this.keys[i]] = value[this.keys[i]];
      }
    }

    return of(Object.keys(result).length ? (result as T) : undefined);
  }
}
