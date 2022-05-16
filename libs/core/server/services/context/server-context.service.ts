import { ContextService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { defer, Observable, of } from 'rxjs';
import { SSRStreamParserService } from '../ssr-stream-parser';

export class ServerContextService implements ContextService {
  protected dataKey = 'data-';

  constructor(protected streamParser = inject(SSRStreamParserService)) {}

  provide(element: Element, key: string, value: unknown): void {
    element.setAttribute(`${this.dataKey}${key}`, JSON.stringify(value));
  }

  get<T>(element: Element, key: string): Observable<T> {
    return defer(() => {
      const stack = this.streamParser.getStreamStack();
      const counter = stack.length - 1;

      for (let i = counter; i >= 0; i--) {
        const value = stack[i][key];

        if (value === undefined) {
          continue;
        }

        return of(JSON.parse(value));
      }

      return of(undefined);
    });
  }

  remove(element: Element, key: string): void {
    element.removeAttribute(`${this.dataKey}${key}`);
  }
}
