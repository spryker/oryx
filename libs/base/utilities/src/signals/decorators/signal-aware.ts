import { ReactiveElement } from '@lit/reactive-element';
import { ClassDescriptor } from '@lit/reactive-element/decorators.js';
import { Type } from '../../misc';
import { SignalController } from '../signal.controller';

const legacySignalAware = (clazz: Type<ReactiveElement>) => {
  (clazz as any).addInitializer((instance: ReactiveElement) => {
    new SignalController(instance);
  });
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
