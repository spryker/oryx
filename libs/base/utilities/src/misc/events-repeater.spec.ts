import { fixture, nextFrame } from '@open-wc/testing-helpers';
import { html } from 'lit';
import { addEventsAction, removeEventsAction } from './events-repeater';

describe('addEventsAction', () => {
  let element: HTMLElement;

  beforeEach(async () => {
    element = await fixture(
      html`<div>
        <div class="inner" repeatable="click, hover"></div>
      </div>`
    );
  });

  it('should add stoppropogation for element with `repeatable` attribute', () => {
    const callback = vi.fn();
    element.addEventListener('click', callback);
    addEventsAction();
    element
      .querySelector('.inner')
      ?.dispatchEvent(new Event('click', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
  });

  it('should add stoppropogation for element with `repeatable` attribute', () => {
    const callback = vi.fn();
    element.addEventListener('hover', callback);
    addEventsAction();
    element
      .querySelector('.inner')
      ?.dispatchEvent(new Event('hover', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
  });
});

describe('removeEventsAction', () => {
  let element: HTMLElement;

  beforeEach(async () => {
    element = await fixture(
      html`<div>
        <div class="inner" repeatable="click,hover"></div>
      </div>`
    );
  });

  it('should remove stoppropogation from element with `repeatable` attribute and repeat event', async () => {
    const callback = vi.fn();
    element.addEventListener('click', callback);
    addEventsAction();
    element
      .querySelector('.inner')
      ?.dispatchEvent(new Event('click', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
    removeEventsAction(element);
    await nextFrame();
    expect(callback).toHaveBeenCalled();
  });

  it('should add stoppropogation for element with `repeatable`attribute and repeat event', async () => {
    const callback = vi.fn();
    element.addEventListener('hover', callback);
    addEventsAction();
    element
      .querySelector('.inner')
      ?.dispatchEvent(new Event('hover', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
    removeEventsAction(element);
    await nextFrame();
    expect(callback).toHaveBeenCalled();
  });
});
