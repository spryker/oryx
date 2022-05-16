/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BehaviorSubject, defer, Observable, of } from 'rxjs';
import { ContextService } from './context.service';

declare global {
  interface Node {
    host: Element;
  }
}

export class DefaultContextService implements ContextService {
  protected dataKey = 'data-';
  protected contextMap = new WeakMap<
    Element,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Map<string, BehaviorSubject<any>>
  >();

  provide(element: Element, key: string, value: unknown): void {
    if (!this.hasKey(element, key)) {
      this.contextMap.get(element)!.set(key, new BehaviorSubject(undefined));
    }

    const stringifiedValue = JSON.stringify(value);

    this.contextMap.get(element)!.get(key)!.next(value);
    element.setAttribute(this.getAttributeName(key), stringifiedValue);
  }

  get<T>(element: Element, key: string): Observable<T> {
    return defer(() => {
      const { element: currentElement, elementWithAttr } =
        this.closestPassShadow(element, this.getAttributeName(key));

      if (currentElement && this.hasKey(currentElement, key)) {
        return this.contextMap.get(currentElement)!.get(key)!;
      }

      if (elementWithAttr) {
        const value = JSON.parse(
          elementWithAttr.getAttribute(this.getAttributeName(key))!
        );
        this.provide(elementWithAttr, key, value);

        return this.contextMap.get(elementWithAttr)!.get(key)!;
      }

      return of(undefined);
    });
  }

  remove(element: Element, key: string): void {
    element.removeAttribute(this.getAttributeName(key));

    if (!this.hasKey(element, key)) {
      return;
    }

    const namespaceValues = this.contextMap.get(element)!;

    namespaceValues.get(key)?.next(undefined);
    namespaceValues.get(key)?.complete();
    namespaceValues.delete(key);

    if (!namespaceValues.size) {
      this.contextMap.delete(element);
    }
  }

  protected getAttributeName(key: string): string {
    return `${this.dataKey}${key}`;
  }

  protected hasKey(element: Element, key: string): boolean {
    if (!this.contextMap.has(element)) {
      this.contextMap.set(element, new Map());
    }

    return this.contextMap.get(element)!.has(key);
  }

  protected closestPassShadow(
    element: Element | Window | Document,
    selector: string
  ): {
    element?: Element;
    elementWithAttr?: Element;
  } {
    const isElement = (
      element: Element | Window | Document
    ): element is Element => {
      return element && element !== window && element !== document;
    };

    while (isElement(element)) {
      const result = this.closest(element, selector);

      if (result) {
        return result;
      }

      element = element.getRootNode().host;
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
      const hasElement = this.contextMap.has(element);

      if (hasElement) {
        return {
          element: element,
        };
      }

      const hasAttr = element.hasAttribute(selector);

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
