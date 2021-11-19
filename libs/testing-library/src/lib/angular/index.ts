import { By } from '@angular/platform-browser';
import {
  render as angularRender,
  RenderResult,
  RenderTemplateOptions,
  screen as angularScreen,
} from '@testing-library/angular';
import {
  ChildComponent,
  LibrarySpecific,
  Type,
  WrapperComponent,
} from '../types';

export class AngularTesting implements LibrarySpecific {
  constructor(
    private rendered: RenderResult<WrapperComponent, WrapperComponent>
  ) {}

  getPropFromChild<P>(ChildComponent: Type<ChildComponent>, prop: string): P {
    return this.rendered.fixture.debugElement.query(
      By.directive(ChildComponent)
    ).componentInstance[prop];
  }

  fireCustomEvent(
    ChildComponent: Type<ChildComponent>,
    eventName: string,
    payload?: unknown
  ): void {
    this.rendered.fixture.debugElement
      .query(By.directive(ChildComponent))
      .triggerEventHandler(eventName, payload);
  }

  update(): void {
    this.rendered.detectChanges();
  }
}

export const screen = angularScreen;

export const render = async (
  template: string,
  options: RenderTemplateOptions<WrapperComponent>
): Promise<AngularTesting> => {
  const rendered = await angularRender(template, options);

  return new AngularTesting(rendered);
};
