/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { inject, INJECTOR } from '@spryker-oryx/di';
import {
  BehaviorSubject,
  distinctUntilChanged,
  isObservable,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import {
  ContextFallback,
  ContextFallbackHandler,
  ContextSerializer,
  ContextService,
} from './context.service';

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

  protected serializers = new Map<string, ContextSerializer | null>();

  constructor(protected injector = inject(INJECTOR)) {}

  provide(element: Element, key: string, value: unknown): void {
    this.serialize(key, value).subscribe((serialized) =>
      element.setAttribute(this.getAttributeName(key), serialized)
    );

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

  get<T>(element: Element | null, key: string): Observable<T | undefined> {
    return this.triggerManifest$.pipe(
      startWith(undefined),
      switchMap(() => {
        if (element) {
          const { element: currentElement, elementWithAttr } =
            this.closestPassShadow(element, this.getAttributeName(key), key);

          if (currentElement && this.hasKey(currentElement, key)) {
            return this.manifest.get(currentElement)!.get(key)!;
          }

          if (elementWithAttr) {
            return this.deserialize(
              key,
              elementWithAttr.getAttribute(this.getAttributeName(key))!
            ).pipe(
              tap((value) => this.provide(elementWithAttr, key, value)),
              switchMap(() => this.manifest.get(elementWithAttr)!.get(key)!)
            );
          }
        }
        return of(undefined);
      }),
      this.contextFallback(key, element),
      distinctUntilChanged((a, b) =>
        typeof a === 'object'
          ? JSON.stringify(a) === JSON.stringify(b)
          : a === b
      )
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
    token: string,
    element: Element | null
  ): (observable$: Observable<T | undefined>) => Observable<T | undefined> {
    return (observable$) =>
      observable$.pipe(
        switchMap((value) => {
          if (value !== undefined) return of(value);

          try {
            const contextFallback = this.injector.inject<
              Observable<T> | ContextFallbackHandler<T>
            >(`${ContextFallback}${token}`);

            return isObservable(contextFallback)
              ? contextFallback
              : contextFallback({ element });
          } catch (_) {
            return of(undefined);
          }
        })
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
    selector: string,
    key: string
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
      const result = this.closest(element, selector, key);

      if (result) {
        return result;
      }

      element = element.getRootNode?.().host;
    }

    return {};
  }

  protected closest(
    element: Element | null,
    selector: string,
    key: string
  ): {
    element?: Element;
    elementWithAttr?: Element;
  } | null {
    while (element) {
      const hasElement =
        this.manifest.has(element) && this.manifest.get(element)!.has(key);

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

  private getSerializer<T>(key: string): ContextSerializer<T> | null {
    if (!this.serializers.has(key)) {
      this.serializers.set(
        key,
        this.injector.inject(`${ContextSerializer}${key}`, null)
      );
    }
    return this.serializers.get(key) as ContextSerializer<T> | null;
  }

  public serialize<T>(key: string, value: T): Observable<string> {
    const serializer = this.getSerializer(key);
    if (serializer) return serializer.serialize(value);
    return typeof value === 'string' ? of(value) : of(JSON.stringify(value));
  }

  public deserialize<T = unknown>(
    key: string,
    value: string | undefined
  ): Observable<T | undefined> {
    if (value !== undefined) {
      const serializer = this.getSerializer<T>(key);
      if (serializer) return serializer.deserialize(value);

      try {
        value = JSON.parse(value);
      } catch {
        // fallback to string value if JSON.parse will fail
      }
    }
    return of(value as T);
  }

  distill<Entity extends Qualifier, Qualifier = unknown>(
    key: string,
    value: Entity
  ): Observable<Qualifier | undefined> {
    const serializer = this.getSerializer<Entity>(key);
    if (serializer) {
      return serializer.distill
        ? serializer.distill(value)
        : serializer
            .serialize(value)
            .pipe(switchMap((value) => serializer.deserialize(value)));
    }
    return of(value as Qualifier | undefined);
  }
}
