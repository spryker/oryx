import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';
import {
  HYDRATE_EVENT,
  enableEventsForHydration,
  repeatHydrationEvents,
  stopEventsForHydration,
} from './hydrate-events.js';

describe('stopEventsForHydration', () => {
  let element: HTMLElement;

  beforeEach(async () => {
    element = await fixture(
      html`<div>
        <div class="inner" hydration-events="click, hover"></div>
      </div>`
    );
  });

  it('should add stoppropogation for element with `hydration-events` attribute', () => {
    const callback = vi.fn();
    element.addEventListener('click', callback);
    stopEventsForHydration();
    element
      .querySelector('.inner')
      ?.dispatchEvent(new Event('click', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
  });

  it('should add stoppropogation for element with `hydration-events` attribute', () => {
    const callback = vi.fn();
    element.addEventListener('hover', callback);
    stopEventsForHydration();
    element
      .querySelector('.inner')
      ?.dispatchEvent(new Event('hover', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
  });

  it('should dispatchEvent `HYDRATE_EVENT` event', () => {
    const callback = vi.fn();
    element.addEventListener(HYDRATE_EVENT, callback);
    stopEventsForHydration();
    element
      .querySelector('.inner')
      ?.dispatchEvent(new Event('hover', { bubbles: true }));
    expect(callback).toHaveBeenCalled();
  });
});

describe('enableEventsForHydration', () => {
  let element: HTMLElement;

  beforeEach(async () => {
    element = await fixture(
      html`<div>
        <div class="inner" hydration-events="click,hover"></div>
      </div>`
    );
  });

  it('should remove stoppropogation from element with `hydration-events` attribute and return repeated event', async () => {
    const callback = vi.fn();
    let event: Event = {} as Event;

    element.addEventListener('click', (e) => {
      callback(e);
      event = e;
    });
    stopEventsForHydration();
    element
      .querySelector('.inner')
      ?.dispatchEvent(new Event('click', { bubbles: true, composed: true }));
    expect(callback).not.toHaveBeenCalled();
    const events = enableEventsForHydration(element as unknown as ShadowRoot);
    element
      .querySelector('.inner')
      ?.dispatchEvent(new Event('click', { bubbles: true, composed: true }));
    expect(callback).toHaveBeenCalled();
    expect([[event]]).toEqual(events);
  });

  it('should remove stoppropogation from element with `hydration-events` attribute and return repeated event', async () => {
    const callback = vi.fn();
    let event: Event = {} as Event;

    element.addEventListener('hover', (e) => {
      callback(e);
      event = e;
    });
    stopEventsForHydration();
    element
      .querySelector('.inner')
      ?.dispatchEvent(new Event('hover', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
    const events = enableEventsForHydration(element as unknown as ShadowRoot);
    element
      .querySelector('.inner')
      ?.dispatchEvent(new Event('hover', { bubbles: true }));
    expect(callback).toHaveBeenCalled();
    expect([[event]]).toEqual(events);
  });
});

describe('repeatHydrationEvents', () => {
  let element: HTMLElement;

  beforeEach(async () => {
    element = await fixture(
      html`<div>
        <div class="inner" hydration-events="click,hover"></div>
      </div>`
    );
  });

  it('should repeat events by list', async () => {
    const callback = vi.fn();
    element.addEventListener('click', callback);
    stopEventsForHydration();
    element
      .querySelector('.inner')
      ?.dispatchEvent(new Event('click', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
    const events = enableEventsForHydration(element as unknown as ShadowRoot);
    repeatHydrationEvents(element as unknown as ShadowRoot, events);
    expect(callback).toHaveBeenCalled();
  });

  it('should repeat events by list', async () => {
    const callback = vi.fn();
    element.addEventListener('hover', callback);
    stopEventsForHydration();
    element
      .querySelector('.inner')
      ?.dispatchEvent(new Event('hover', { bubbles: true }));
    expect(callback).not.toHaveBeenCalled();
    const events = enableEventsForHydration(element as unknown as ShadowRoot);
    repeatHydrationEvents(element as unknown as ShadowRoot, events);
    expect(callback).toHaveBeenCalled();
  });
});
