/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
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
    element.setAttribute(this.keyGenerator(key), stringifiedValue);
  }

  get<T>(element: Element, key: string): Observable<T> {
    const currentElement = this.closestPassShadow(
      `[${this.keyGenerator(key)}]`,
      element
    );

    if (!currentElement) {
      return EMPTY;
    }

    if (this.hasKey(currentElement, key)) {
      return this.contextMap.get(currentElement)!.get(key)!;
    }

    const namespaceValues = this.contextMap.get(currentElement);
    const value = JSON.parse(
      currentElement.getAttribute(this.keyGenerator(key))!
    );

    const subject = new BehaviorSubject(value);

    namespaceValues?.set(key, subject);

    return subject;
  }

  remove(element: Element, key: string): void {
    element.removeAttribute(this.keyGenerator(key));

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

  protected keyGenerator(key: string): string {
    return `${this.dataKey}${key}`;
  }

  protected hasKey(element: Element, key: string): boolean {
    if (!this.contextMap.has(element)) {
      this.contextMap.set(element, new Map());
    }

    return this.contextMap.get(element)!.has(key);
  }

  protected closestPassShadow(
    selector: string,
    element: Element | Window | Document
  ): Element | null {
    const isElement = (
      currentElement: Element | Window | Document
    ): currentElement is Element => {
      return (
        currentElement &&
        currentElement !== window &&
        currentElement !== document
      );
    };

    const closestFrom = (
      currentElement: Element | Window | Document
    ): Element | null => {
      if (!isElement(currentElement)) {
        return null;
      }

      return (
        currentElement.closest(selector) ??
        closestFrom(currentElement.getRootNode().host)
      );
    };

    return closestFrom(element);
  }
}
