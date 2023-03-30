import { StateSignal } from './signals';

export type Signal<T = unknown> = {
  (): StateSignal<T>;
  (value: T): void;
  valueOf(): T;
  [Symbol.toPrimitive](hint: 'default' | 'string' | 'number'): T;
} & {
  [K in keyof T]: T[K];
} & {
  [K in '+' | '-' | '*' | '/' | '%']: (arg: T) => T;
};

export function createSignal<T = unknown>(initialValue: T): Signal<T> {
  const stateSignal = new StateSignal(initialValue);

  const handler: ProxyHandler<any> = {
    get(target, prop) {
      if (prop === 'valueOf' || prop === 'toJSON') {
        return () => stateSignal.value;
      } else if (prop === 'toString') {
        return () => String(stateSignal.value);
      }
      return Reflect.get(target, prop);
    },

    set() {
      return false;
    },

    apply(target, thisArg, args): StateSignal<T> | void {
      if (args.length > 0) {
        stateSignal.set(args[0]);
      } else {
        return stateSignal;
      }
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const signal = new Proxy<any>(() => {}, handler);
  return signal;
}

// export function computed<T>(computation: () => T): Signal<T> {
//   const coreComputed = new CoreComputed(computation);
//
//   const handler: ProxyHandler<any> = {
//     get(target, prop) {
//       if (prop === Symbol.toPrimitive) {
//         return (hint: string) => {
//           if (hint === 'number' || hint === 'default') {
//             return coreComputed.value;
//           }
//           return String(coreComputed.value);
//         };
//       }
//       return Reflect.get(target, prop);
//     },
//
//     set(target, prop, value) {
//       if (prop === Symbol.toPrimitive) {
//         return false;
//       }
//       Reflect.set(target, prop, value);
//       return true;
//     },
//
//     apply(target, thisArg, args) {
//       return coreComputed;
//     },
//   };
//
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   const magicComputed = new Proxy<any>(coreComputed, handler);
//   return magicComputed as any;
// }
//
// export function effect(fn: () => void): CoreEffect {
//   return new CoreEffect(fn);
// }
//

// export type Signal<T = unknown> = {
//   set: (value: T) => void;
// } & {
//   [P in keyof T]: T[P];
// } & {
//   valueOf(): T;
//   [Symbol.toPrimitive](hint: 'default' | 'string' | 'number'): T;
// };
//
// export function createSignal<T = unknown>(initialValue: T): Signal<T> {
//   const stateSignal = new StateSignal(initialValue);
//
//   const handler: ProxyHandler<any> = {
//     get(target, prop) {
//       if (prop === 'set') {
//         return (value: T) => stateSignal.set(value);
//       } else if (prop === Symbol.toPrimitive) {
//         return (hint: string) => {
//           if (hint === 'number' || hint === 'default') {
//             return stateSignal.value;
//           }
//           return String(stateSignal.value);
//         };
//       }
//       return Reflect.get(stateSignal.value as any, prop);
//     },
//
//     set(target, prop, value) {
//       if (prop === Symbol.toPrimitive) {
//         return false;
//       }
//       Reflect.set(target, prop, value);
//       return true;
//     }
//   };
//
//   const magicSignal = new Proxy<any>({}, handler);
//   return magicSignal as any;
// }

// export function createSignal<T = unknown>(initialValue: T): Signal<T> {
//   const stateSignal = new StateSignal(initialValue);
//
//   const handler: ProxyHandler<any> = {
//     get(target, prop) {
//       if (prop === 'set') {
//         return (value: T) => stateSignal.set(value);
//       } else if (prop === 'valueOf') {
//         return () => stateSignal.value;
//       } else if (prop === 'toString') {
//         return () => String(stateSignal.value);
//       }
//       return Reflect.get(target, prop);
//     },
//
//     set(target, prop, value) {
//       if (prop === 'valueOf') {
//         return false;
//       }
//       Reflect.set(target, prop, value);
//       return true;
//     },
//
//     apply(target, thisArg, args): StateSignal<T> | void {
//       if (args.length > 0) {
//         stateSignal.set(args[0]);
//       } else {
//         return stateSignal;
//       }
//     },
//
//   };
//
//   const magicSignal = new Proxy<any>(() => {} , handler);
//   return magicSignal as any;
// }
