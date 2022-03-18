import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { stub } from 'sinon';
import { EventsController } from './events.controller';
import './index';
import { Types } from './notification.model';

@customElement('fake-component')
class FakeComponent extends LitElement {
  @property({ type: String }) type: Types = Types.INFO;

  eventsController = new EventsController(this);

  render(): TemplateResult {
    return html` <slot></slot> `;
  }
}

describe('EventsController', () => {
  let element: FakeComponent;

  describe('events', () => {
    const closeCallback = stub();
    const openCallback = stub();

    beforeEach(async () => {
      element = await fixture(html`
        <fake-component
          @oryx.open=${openCallback}
          @oryx.close=${closeCallback}
        ></fake-component>
      `);
    });

    it('should be dispatched only once', async () => {
      expect(openCallback).to.be.calledOnce;
      expect(closeCallback).to.not.be.called;

      element.eventsController.dispatchCloseEvent();

      expect(openCallback).to.be.calledOnce;
      expect(closeCallback).to.be.calledOnce;
    });
  });
});
