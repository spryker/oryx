/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { inject, INJECTOR } from '@spryker-oryx/di';
import {
  BehaviorSubject,
  distinctUntilChanged,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { ContextService, ContextServiceFallback } from './context.service';

declare global {
  interface Node {
    host: Element;
  }
}

export class DefaultContextService implements ContextService {
  protected dataKey = 'data-';
  protected manifest = new WeakMap<
    Element,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Map<string, BehaviorSubject<any>>
  >();
  protected triggerManifest$ = new Subject<void>();

  constructor(protected injector = inject(INJECTOR)) {}

  provide(element: Element, key: string, value: unknown): void {
    const stringifiedValue =
      typeof value === 'string' ? value : JSON.stringify(value);

    element.setAttribute(this.getAttributeName(key), stringifiedValue);

    if (!this.hasKey(element, key)) {
      if (!this.manifest.has(element)) {
        this.manifest.set(element, new Map());
      }

      this.manifest.get(element)!.set(key, new BehaviorSubject(value));

      this.triggerManifest$.next();

      return;
    }

    this.manifest.get(element)!.get(key)!.next(value);
  }

  get<T>(element: Element | null, key: string): Observable<T> {
    return this.triggerManifest$.pipe(
      startWith(undefined),
      switchMap(() => {
        if (element) {
          const { element: currentElement, elementWithAttr } =
            this.closestPassShadow(element, this.getAttributeName(key));

          if (currentElement && this.hasKey(currentElement, key)) {
            return this.manifest.get(currentElement)!.get(key)!;
          }

          if (elementWithAttr) {
            let value: string | undefined = elementWithAttr.getAttribute(
              this.getAttributeName(key)
            )!;

            try {
              value = JSON.parse(value);
            } catch {
              // fallback to string value if JSON.parse will fail
            }

            this.provide(elementWithAttr, key, value);

            return this.manifest.get(elementWithAttr)!.get(key)!;
          }
        }
        return of(undefined);
      }),
      this.contextFallback(key),
      distinctUntilChanged()
    );
  }

  remove(element: Element, key: string): void {
    element.removeAttribute(this.getAttributeName(key));

    if (!this.hasKey(element, key)) {
      return;
    }

    const namespaceValues = this.manifest.get(element)!;
    const subject$ = namespaceValues.get(key)!;

    subject$.next(undefined);
    subject$.complete();
    namespaceValues.delete(key);

    if (!namespaceValues.size) {
      this.manifest.delete(element);
    }

    this.triggerManifest$.next();
  }

  protected contextFallback<T>(
    token: string
  ): (observable$: Observable<T>) => Observable<T> {
    return (observable$) =>
      observable$.pipe(
        switchMap((value) =>
          value === undefined
            ? this.injector.inject<Observable<T>>(
                `${ContextServiceFallback}${token}`,
                of(value)
              )
            : of(value)
        )
      );
  }

  protected getAttributeName(key: string): string {
    return `${this.dataKey}${key}`;
  }

  protected hasKey(element: Element, key: string): boolean {
    if (!this.manifest.has(element)) {
      return false;
    }

    return this.manifest.get(element)!.has(key);
  }

  protected closestPassShadow(
    element: Element | Window | Document | undefined,
    selector: string
  ): {
    element?: Element;
    elementWithAttr?: Element;
  } {
    const isElement = (
      element: Element | Window | Document | undefined
    ): element is Element => {
      return !!(element && element !== window && element !== document);
    };

    while (isElement(element)) {
      const result = this.closest(element, selector);

      if (result) {
        return result;
      }

      element = element.getRootNode?.().host;
    }

    return {};
  }

  protected closest(
    element: Element | null,
    selector: string
  ): {
    element?: Element;
    elementWithAttr?: Element;
  } | null {
    while (element) {
      const hasElement = this.manifest.has(element);

      if (hasElement) {
        return {
          element: element,
        };
      }

      const hasAttr = element.hasAttribute?.(selector);

      if (hasAttr) {
        return {
          elementWithAttr: element,
        };
      }

      element = element.parentElement;
    }

    return null;
  }
}
