/* eslint-disable @typescript-eslint/no-explicit-any */
import { UpdatingElement } from 'lit';
import { Subject } from 'rxjs';

export interface DecoratorContext {
  kind: 'field' | 'method';
  key: PropertyKey;
  placement: 'static' | 'prototype' | 'own';
  initializer?: () => Subject<any>;
  extras?: DecoratorContext[];
  finisher?: (clazz: typeof UpdatingElement) => void;
  descriptor?: PropertyDescriptor;
}

export interface ObserveData {
  name: string;
  observedName?: string;
  subject$?: Subject<any>;
}
