import { ReactiveElement } from '@lit/reactive-element';
import { ClassDescriptor } from '@lit/reactive-element/decorators.js';
import { Type } from '@spryker-oryx/di';
import { SignalController } from './signal.controller';

const legacySignalAware = (clazz: Type<ReactiveElement>) => {
  return class extends clazz {
    constructor(...args: any[]) {
      super(...args);
      new SignalController(this);
    }
  } as any;
};

const standardSignalAware = (descriptor: ClassDescriptor) => {
  const { kind, elements } = descriptor;
  return {
    kind,
    elements,
    finisher(clazz: Type<ReactiveElement>) {
      (clazz as any).addInitializer((instance: ReactiveElement) => {
        new SignalController(instance);
      });
      return clazz;
    },
  };
};

export const signalAware =
  <T extends ReactiveElement>(): ((
    classOrDescriptor: Type<T>
  ) => Type<T> | ClassDescriptor | any) =>
  (classOrDescriptor: Type<T> | ClassDescriptor) =>
    typeof classOrDescriptor === 'function'
      ? legacySignalAware(classOrDescriptor)
      : standardSignalAware(classOrDescriptor as ClassDescriptor);
