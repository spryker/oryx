import { ReactiveElement, UpdatingElement } from 'lit';
import { Subject } from 'rxjs';
import { isLegacyDecorator } from '../../guards';
import { DecoratorContext, TargetDecorator } from '../../model';

interface DecoratorProps<T = TargetDecorator | ReactiveElement> {
  context: T;
  subjectKey: string;
  property: string | string[];
}

const throwSubjectError = (subject$: unknown): void => {
  if (subject$ && !(subject$ as Record<string, unknown>).next) {
    throw `Invalid observe value: incorrect ${subject$} for observe decorator, please use rxjs subjects`;
  }
};

const getReactiveDescriptor = (
  proto: TargetDecorator | ReactiveElement,
  propertyKey: string
): PropertyDescriptor => {
  let ownDescriptor: PropertyDescriptor | undefined;
  let prototype = proto;

  while (prototype.constructor.name !== 'LitElement') {
    ownDescriptor = Object.getOwnPropertyDescriptor(prototype, propertyKey);

    if (ownDescriptor) {
      break;
    }

    prototype = Object.getPrototypeOf(prototype);
  }

  if (!ownDescriptor) {
    throw `Invalid observed property name: incorrect ${propertyKey} for observe decorator, please use already created reactive property name as an element to observe`;
  }

  return ownDescriptor;
};

const createReactiveProperty = (
  { context, subjectKey, property }: DecoratorProps,
  isLegacy = true
): symbol | string => {
  const reactiveProps = Array.isArray(property) ? property : [property];
  const internalSubjectKey = isLegacy ? Symbol(subjectKey) : subjectKey;

  for (const propertyKey of reactiveProps) {
    const reactiveDescriptor = getReactiveDescriptor(context, propertyKey);
    const propertyDescriptor = {
      ...reactiveDescriptor,
      set(
        this: Record<symbol | string, Subject<unknown>>,
        newValue: unknown
      ): void {
        const prevValue = this[propertyKey];

        reactiveDescriptor.set?.call(this, newValue);

        if (this[internalSubjectKey] && newValue !== prevValue) {
          const value = Array.isArray(property)
            ? property.map((key) =>
                propertyKey === key ? newValue : this[key]
              )
            : newValue;
          this[internalSubjectKey].next(value);
        }
      },
    };

    Object.defineProperty(context, propertyKey, propertyDescriptor);
  }

  return internalSubjectKey;
};

const legacyObserve = ({
  context,
  subjectKey,
  property,
}: DecoratorProps): void => {
  const internalSubjectKey = createReactiveProperty({
    context,
    subjectKey,
    property,
  });

  const subjectDescriptor = {
    get(this: TargetDecorator): unknown {
      return this[internalSubjectKey];
    },
    set(this: TargetDecorator, value$: Subject<unknown>): void {
      throwSubjectError(value$);

      const descriptor = {
        value: value$,
        enumerable: false,
        configurable: true,
      };

      Object.defineProperty(this, internalSubjectKey, descriptor);
    },
    enumerable: false,
    configurable: true,
  };

  Object.defineProperty(context, subjectKey, subjectDescriptor);
};

const standardObserve = ({
  context,
  subjectKey,
  property,
}: DecoratorProps<DecoratorContext>): DecoratorContext => {
  return {
    ...context,
    initializer(this: TargetDecorator): Subject<unknown> {
      const subject$ = context.initializer?.call(this);

      throwSubjectError(subject$);

      if (Array.isArray(property)) {
        subject$.next(property.map((propertyKey) => this[propertyKey]));
      } else {
        subject$.next(this[property]);
      }

      return subject$;
    },
    finisher(clazz: typeof UpdatingElement): void {
      createReactiveProperty(
        {
          context: clazz.prototype,
          subjectKey,
          property,
        },
        false
      );
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function observe(property?: string | string[]): any {
  return (
    context: DecoratorContext | TargetDecorator,
    name?: PropertyKey
  ): DecoratorContext | void => {
    const subjectKey = (
      isLegacyDecorator(context, name) ? name : context.key
    ) as string;
    const propertyKey = property ?? subjectKey.slice(0, -1);

    return isLegacyDecorator(context, name)
      ? legacyObserve({ context, subjectKey, property: propertyKey })
      : standardObserve({ context, subjectKey, property: propertyKey });
  };
}
