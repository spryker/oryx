import { elementUpdated, expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import * as sinon from 'sinon';
import {
  NotificationRegistry,
  NotificationStrategy,
  RegistryController,
} from '.';

@customElement('fake-component')
class FakeComponent extends LitElement {
  controller = new RegistryController(this);

  @state()
  get registry(): NotificationRegistry[] {
    return this.controller.registry;
  }

  open(strategy: NotificationStrategy): void {
    this.controller.registry = [...this.controller.registry, strategy];
  }

  protected renderNotification(registry: NotificationRegistry): TemplateResult {
    return html`
      <oryx-notification
        ?visible=${registry.visible}
        @oryx.close=${(): void =>
          this.controller.handleNotificationClose(registry.key as string)}
        @mouseenter=${(): void =>
          this.controller.preventAutoClose(registry.key as string)}
        @transitionend=${(): void =>
          this.controller.handleTransitionEnd(registry.key as string)}
      ></oryx-notification>
    `;
  }

  protected override render(): TemplateResult {
    return html`
      ${repeat(
        this.registry,
        ({ key }) => key,
        (item) => this.renderNotification(item)
      )}
    `;
  }
}

describe('RegistryController', () => {
  const autoCloseTime = 200;
  let element: FakeComponent;

  const updated = async (): Promise<void> => {
    await element.updateComplete;
    await elementUpdated(element);
  };

  const addNotification = async (
    strategy: NotificationStrategy = {}
  ): Promise<void> => {
    element.open(strategy);
    await updated();
  };

  describe('notifications', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-component></fake-component>`);
    });

    it('should have unique keys', async () => {
      await addNotification();
      await addNotification();
      expect(element.registry[0]?.key).to.be.exist;
      expect(element.registry[1]?.key).to.be.exist;
      expect(element.registry[0]?.key).to.be.not.equal(
        element.registry[1]?.key
      );
    });
  });

  describe('notification`s visibility state', () => {
    let clock: sinon.SinonFakeTimers;

    beforeEach(async () => {
      clock = sinon.useFakeTimers();
      element = await fixture(html`<fake-component></fake-component>`);
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should be mounted and visible after opening', async () => {
      await addNotification();
      await clock.tick(0);
      expect(element.registry[0]?._mounted).to.be.true;
      expect(element.registry[0]?.visible).to.be.true;
    });

    it('should auto-close after delay', async () => {
      await addNotification({ autoCloseTime });

      await clock.tick(0);
      expect(element.registry[0]?.visible).to.be.true;

      await clock.tick(autoCloseTime);
      expect(element.registry[0]?.visible).to.be.false;

      element.renderRoot.children[0]?.dispatchEvent(new Event('transitionend'));

      await updated();
      expect(element.registry[0]).to.be.not.exist;
    });

    it('should not be auto-closed if autoClose param equal false', async () => {
      element.open({ autoCloseTime });
      element.open({ autoClose: false });

      await updated();
      await clock.tick(0);

      expect(element.registry[0]?.visible).to.be.true;
      expect(element.registry[1]?.visible).to.be.true;

      await clock.tick(autoCloseTime + 1);
      expect(element.registry[0]?.visible).to.be.false;
      expect(element.registry[1]?.visible).to.be.true;
    });
  });

  describe('auto-close', () => {
    let clock: sinon.SinonFakeTimers;

    beforeEach(async () => {
      clock = sinon.useFakeTimers();
      element = await fixture(html`<fake-component></fake-component>`);
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should be prevented', async () => {
      await addNotification({ autoCloseTime });
      await clock.tick(0);

      element.renderRoot.children[0]?.dispatchEvent(new Event('mouseenter'));

      await clock.tick(autoCloseTime + 1);
      expect(element.registry[0]?.visible).to.be.true;
    });
  });
});
