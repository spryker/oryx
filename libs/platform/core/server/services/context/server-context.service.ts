import { DefaultContextService } from '@spryker-oryx/core';
import { defer, Observable, of, ReplaySubject } from 'rxjs';
import { DefaultSSRStreamParserService } from './default-ssr-stream-parser';

export class ServerContextService extends DefaultContextService {
  protected streamParser = new DefaultSSRStreamParserService();
  // TODO: Create mini service or use proper hook, when Lit will expose it which signalize rendered state.
  rendered$ = new ReplaySubject<void>(1);

  provide(element: Element, key: string, value: unknown): void {
    this.serialize(key, value).subscribe((serialized) =>
      element.setAttribute(`${this.dataKey}${key}`, serialized)
    );
  }

  get<T>(element: Element | null, key: string): Observable<T | undefined> {
    return defer(() => {
      if (element) {
        const stack = this.streamParser.getStreamStack();
        const counter = stack.length - 1;

        for (let i = counter; i >= 0; i--) {
          const value = stack[i][key];

          if (value === undefined) {
            continue;
          }

          return this.deserialize<T>(key, value);
        }
      }

      return of(undefined);
    }).pipe(this.contextFallback(key));
  }

  remove(element: Element, key: string): void {
    element.removeAttribute(`${this.dataKey}${key}`);
  }

  fillStream(stream: string): void {
    this.streamParser.fillStream(stream);
  }

  rendered(): void {
    this.rendered$.next();
    this.rendered$.complete();
  }
}
