/* eslint-disable @typescript-eslint/no-explicit-any */
import { UpdatingElement } from 'lit';
import { BehaviorSubject, Subject } from 'rxjs';
import { DecoratorContext } from '../internal/types';

const subjectAssigner = (subject$?: Subject<any>): Subject<any> => {
  if (subject$ && !subject$?.next) {
    throw `Invalid observe value: incorrect ${subject$} for observe decorator, please use rxjs subjects`;
  }

  if (!subject$) {
    return new BehaviorSubject(null);
  }

  return subject$;
};

const implementObserve = (
  proto: Record<string, any> | typeof UpdatingElement,
  propName: string,
  observedName: string
): void => {
  const ownDescriptor = Object.getOwnPropertyDescriptor(proto, observedName);
  const internalSubjectName = Symbol(`__${propName}-subject$`);
  let innerValue: unknown;

  if (!ownDescriptor) {
    throw `Invalid observed property name: incorrect ${observedName} for observe decorator, please use already created reactive property name as an element to observe`;
  }

  const observedDescriptor = {
    ...ownDescriptor,
    set(this: any, newValue: any): void {
      ownDescriptor.set?.call(this, newValue);

      if (this[internalSubjectName]) {
        this[internalSubjectName].next(newValue);
      }

      innerValue = newValue;
    },
  };
  const observableDescriptor = {
    get(this: any): Subject<any> {
      if (!this[internalSubjectName]) {
        const descriptor = {
          value: new BehaviorSubject(innerValue),
          enumerable: false,
          configurable: true,
        };

        Object.defineProperty(this, internalSubjectName, descriptor);
      }

      return this[internalSubjectName];
    },
    set(this: any, value$: Subject<any>): void {
      const isUpdateSubjectInstance =
        this[internalSubjectName]?.constructor?.name !==
        value$?.constructor?.name;

      if (!this[internalSubjectName] || isUpdateSubjectInstance) {
        const descriptor = {
          value: subjectAssigner(value$),
          enumerable: false,
          configurable: true,
        };

        Object.defineProperty(this, internalSubjectName, descriptor);
      }

      if (isUpdateSubjectInstance) {
        this[internalSubjectName].next(innerValue);
      }
    },
    enumerable: false,
    configurable: true,
  };

  Object.defineProperty(proto, observedName, observedDescriptor);
  Object.defineProperty(proto, propName, observableDescriptor);
};

const standardObserve = (
  context: DecoratorContext,
  propName: string,
  observedName: string
): DecoratorContext => {
  return {
    ...context,
    key: Symbol(),
    finisher(clazz: typeof UpdatingElement): void {
      implementObserve(clazz.prototype, propName, observedName);
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
 *  @state()
 *  prop2 = 'prop2';
 *
 *  @observe()
 *  prop2: BehaviorSubject;
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
    context: DecoratorContext | Record<string, any>,
    name?: PropertyKey
  ): DecoratorContext | void => {
    const isLegacy = name !== undefined;
    const propName = (isLegacy ? name : context.key) as string;
    const observedName = property ?? propName.slice(0, -1);

    return isLegacy
      ? implementObserve(context as Record<string, any>, propName, observedName)
      : standardObserve(context as DecoratorContext, propName, observedName);
  };
}
