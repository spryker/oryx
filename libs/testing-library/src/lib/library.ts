import { EventType, fireEvent } from '@testing-library/dom';
import { ChildComponent, LibrarySpecific, Type, Wrapper } from './types';

export class LibraryWrapper implements Wrapper {
  constructor(private rendered: LibrarySpecific) {}

  getPropFromChild<P>(ChildComponent: Type<ChildComponent>, prop: string): P {
    return this.rendered.getPropFromChild(ChildComponent, prop);
  }

  fireCustomEvent(
    ChildComponent: Type<ChildComponent>,
    eventName: string,
    payload?: unknown
  ): void {
    this.rendered.fireCustomEvent(ChildComponent, eventName, payload);
  }

  fireEvent(
    name: EventType,
    element: Document | Element | Window | Node,
    options?: Record<string, unknown>
  ): void {
    fireEvent[name](element, options);
  }

  update(): void {
    this.rendered.update();
  }
}
