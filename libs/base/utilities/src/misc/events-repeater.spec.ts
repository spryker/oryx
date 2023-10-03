import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';
import {
  addEventsAction,
  removeEventsAction,
  repeatEvents,
} from './events-repeater';

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

  it('should remove stoppropogation from element with `repeatable` attribute and return repeated event', async () => {
    const callback = vi.fn();
    let event: Event = {} as Event;

    element.addEventListener('click', (e) => {
      callback(e);
      event = e;
    });
    addEventsAction();
    element
      .querySelector('.inner')
      ?.dispatchEvent(new Event('click', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
    const events = removeEventsAction(element);
    element
      .querySelector('.inner')
      ?.dispatchEvent(new Event('click', { bubbles: true }));
    expect(callback).toHaveBeenCalled();
    expect([[event]]).toEqual(events);
  });

  it('should remove stoppropogation from element with `repeatable` attribute and return repeated event', async () => {
    const callback = vi.fn();
    let event: Event = {} as Event;

    element.addEventListener('hover', (e) => {
      callback(e);
      event = e;
    });
    addEventsAction();
    element
      .querySelector('.inner')
      ?.dispatchEvent(new Event('hover', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
    const events = removeEventsAction(element);
    element
      .querySelector('.inner')
      ?.dispatchEvent(new Event('hover', { bubbles: true }));
    expect(callback).toHaveBeenCalled();
    expect([[event]]).toEqual(events);
  });
});

describe('repeatEvents', () => {
  let element: HTMLElement;

  beforeEach(async () => {
    element = await fixture(
      html`<div>
        <div class="inner" repeatable="click,hover"></div>
      </div>`
    );
  });

  it('should repeat events by list', async () => {
    const callback = vi.fn();
    element.addEventListener('click', callback);
    addEventsAction();
    element
      .querySelector('.inner')
      ?.dispatchEvent(new Event('click', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
    const events = removeEventsAction(element);
    repeatEvents(element, events);
    expect(callback).toHaveBeenCalled();
  });

  it('should repeat events by list', async () => {
    const callback = vi.fn();
    element.addEventListener('hover', callback);
    addEventsAction();
    element
      .querySelector('.inner')
      ?.dispatchEvent(new Event('hover', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
    const events = removeEventsAction(element);
    repeatEvents(element, events);
    expect(callback).toHaveBeenCalled();
  });
});
