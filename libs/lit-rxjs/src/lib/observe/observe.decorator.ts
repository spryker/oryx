/* eslint-disable @typescript-eslint/no-explicit-any */
import { UpdatingElement } from 'lit';
import { BehaviorSubject, Subject } from 'rxjs';
import { DecoratorContext, ObserveData } from './types';

const subjectAssigner = (subject$?: Subject<any>): Subject<any> => {
  if (subject$ && !subject$?.next) {
    throw `Invalid observe value: incorrect ${subject$} for observe decorators, please use rxjs subjects`;
  }

  if (!subject$) {
    return new BehaviorSubject(null);
  }

  return subject$;
};

const implementObserve = (
  proto: Record<string, any> | typeof UpdatingElement,
  data: ObserveData
): void => {
  const { name, observedName } = data as Required<ObserveData>;
  const ownDescriptor = Object.getOwnPropertyDescriptor(proto, observedName);
  let { subject$ } = data as Required<ObserveData>;
  let innerValue: unknown;

  if (!ownDescriptor) {
    throw `Invalid observed property name: incorrect ${observedName} for observe decorators, please use already created reactive property name as an element to observe`;
  }

  const observedDescriptor = {
    ...ownDescriptor,
    set(newValue: any): void {
      ownDescriptor.set?.call(this, newValue);

      if (subject$) {
        subject$.next(newValue);
      }

      innerValue = newValue;
    },
  };
  const observableDescriptor = {
    get(): Subject<any> {
      if (!subject$) {
        subject$ = new BehaviorSubject(innerValue);
      }

      return subject$;
    },
    set(value$: Subject<any>): void {
      const isUpdateSubjectInstance =
        subject$?.constructor?.name !== value$?.constructor?.name;

      if (!subject$ || isUpdateSubjectInstance) {
        subject$ = subjectAssigner(value$);
      }

      if (isUpdateSubjectInstance) {
        subject$.next(innerValue);
      }
    },
    enumerable: false,
    configurable: true,
  };

  Object.defineProperty(proto, observedName, observedDescriptor);
  Object.defineProperty(proto, name, observableDescriptor);
};

const standardObserve = (
  context: DecoratorContext,
  data: ObserveData
): DecoratorContext => {
  return {
    ...context,
    key: Symbol(),
    finisher(clazz: typeof UpdatingElement): void {
      implementObserve(clazz.prototype, data);
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
    const observeData: ObserveData = isLegacy
      ? {
          name: name as string,
        }
      : {
          name: context.key,
          subject$: context.initializer && context.initializer(),
        };

    if (!isLegacy) {
      observeData.subject$ = subjectAssigner(observeData.subject$);
    }

    observeData.observedName = property ?? observeData.name.slice(0, -1);

    return isLegacy
      ? implementObserve(context as Record<string, any>, observeData)
      : standardObserve(context as DecoratorContext, observeData);
  };
}
