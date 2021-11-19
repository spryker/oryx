import { EventType } from '@testing-library/dom';
export class WrapperComponent {}
export type ChildComponent = WrapperComponent;

export interface Type<T> extends Function {
  new (...args: any[]): T;
}
export type Renderer<W extends LibrarySpecific> = <
  O extends Record<string, unknown>
>(
  template: string,
  options: O
) => Promise<W>;
export type Screen = import('@testing-library/dom').Screen<
  typeof import('@testing-library/dom/types/queries')
>;

export interface LibrarySpecific {
  getPropFromChild: <P>(
    ChildComponent: Type<ChildComponent>,
    prop: string,
    payload?: unknown
  ) => P;
  fireCustomEvent: (
    ChildComponent: Type<ChildComponent>,
    eventName: string,
    payload?: unknown
  ) => void;
  update(): void;
}

export interface Wrapper extends LibrarySpecific {
  fireEvent: (
    name: EventType,
    element: Document | Element | Window | Node,
    options?: Record<string, unknown>
  ) => void;
}
