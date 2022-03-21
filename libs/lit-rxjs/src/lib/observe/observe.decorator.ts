/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactiveElement, UpdatingElement } from 'lit';
import { Subject } from 'rxjs';
import { DecoratorContext, TargetDecorator } from '../internal/types';

const throwSubjectError = (subject$: any): void => {
  if (subject$ && !subject$?.next) {
    throw `Invalid observe value: incorrect ${subject$} for observe decorator, please use rxjs subjects`;
  }
};

const getReactiveDescriptor = (
  proto: TargetDecorator | ReactiveElement,
  propertyKey: string
): PropertyDescriptor => {
  const ownDescriptor = Object.getOwnPropertyDescriptor(proto, propertyKey);

  if (!ownDescriptor) {
    throw `Invalid observed property name: incorrect ${propertyKey} for observe decorator, please use already created reactive property name as an element to observe`;
  }

  return ownDescriptor;
};

const legacyObserve = (
  proto: TargetDecorator | ReactiveElement,
  subjectKey: string,
  propertyKey: string
): void => {
  const reactiveDescriptor = getReactiveDescriptor(proto, propertyKey);
  const internalSubjectKey = Symbol(subjectKey);
  let innerValue: unknown;

  const propertyDescriptor = {
    ...reactiveDescriptor,
    set(this: any, newValue: unknown): void {
      reactiveDescriptor.set?.call(this, newValue);

      if (this[internalSubjectKey]) {
        this[internalSubjectKey].next(newValue);
      }

      innerValue = newValue;
    },
  };

  const subjectDescriptor = {
    get(this: any): Subject<any> {
      return this[internalSubjectKey];
    },
    set(this: any, value$: Subject<any>): void {
      throwSubjectError(value$);

      const descriptor = {
        value: value$,
        enumerable: false,
        configurable: true,
      };

      Object.defineProperty(this, internalSubjectKey, descriptor);

      if (innerValue) {
        this[internalSubjectKey].next(innerValue);
      }
    },
    enumerable: false,
    configurable: true,
  };

  Object.defineProperty(proto, subjectKey, subjectDescriptor);
  Object.defineProperty(proto, propertyKey, propertyDescriptor);
};

const standardObserve = (
  context: DecoratorContext,
  subjectKey: string,
  propertyKey: string
): DecoratorContext => {
  return {
    ...context,
    initializer(this: TargetDecorator): Subject<any> {
      const subject$ = context.initializer?.call(this);

      throwSubjectError(subject$);

      subject$.next(this[propertyKey]);

      return subject$;
    },
    finisher(clazz: typeof UpdatingElement): void {
      const proto = clazz.prototype;
      const reactiveDescriptor = getReactiveDescriptor(proto, propertyKey);

      const propertyDescriptor = {
        ...reactiveDescriptor,
        set(this: Record<string, any>, newValue: unknown): void {
          reactiveDescriptor.set?.call(this, newValue);

          if (this[subjectKey]) {
            this[subjectKey].next(newValue);
          }
        },
      };

      Object.defineProperty(proto, propertyKey, propertyDescriptor);
    },
  };
};

/**
 * Marking a class property with `@observe` will generate a hidden Subject (BehaviorSubject by default), and modify the getters and setters
 *  of that property to update/take from the Subject.
 *
 * Example
 * export class Component extends LitElement {
 *  @property()
 *  prop = 'prop';
 *
 *  @observe()
 *  prop$ = new ReplaySubject();
 *
 *  @state()
 *  prop1 = 'prop1';
 *
 *  @observe()
 *  prop1$ = new BehaviorSubject(this.prop1);
 *
 *  @property()
 *  prop3 = 'prop3';
 *
 *  @observe()
 *  prop3$ = new Subject();
 * }
 */
export function observe(property?: string): any {
  return (
    context: DecoratorContext | TargetDecorator,
    name?: PropertyKey
  ): DecoratorContext | void => {
    const isLegacy = name !== undefined;
    const subjectKey = (isLegacy ? name : context.key) as string;
    const propertyKey = property ?? subjectKey.slice(0, -1);

    return isLegacy
      ? legacyObserve(context as TargetDecorator, subjectKey, propertyKey)
      : standardObserve(context as DecoratorContext, subjectKey, propertyKey);
  };
}
