import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { LitElement, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import {
  NotificationRegistry,
  NotificationStrategy,
  RegistryController,
} from './index';

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
      expect(element.registry[0]?.key).not.toBeNull();
      expect(element.registry[1]?.key).not.toBeNull();
      expect(element.registry[0]?.key).not.toBe(element.registry[1]?.key);
    });
  });

  describe('notification`s visibility state', () => {
    beforeEach(async () => {
      vi.useFakeTimers();
      element = await fixture(html`<fake-component></fake-component>`);
    });

    afterEach(() => {
      vi.clearAllTimers();
    });

    it('should be mounted and visible after opening', async () => {
      await addNotification();
      vi.advanceTimersByTime(0);
      expect(element.registry[0]?._mounted).toBe(true);
      expect(element.registry[0]?.visible).toBe(true);
    });

    it('should auto-close after delay', async () => {
      await addNotification({ autoCloseTime });

      vi.advanceTimersByTime(0);
      expect(element.registry[0]?.visible).toBe(true);

      vi.advanceTimersByTime(autoCloseTime);
      expect(element.registry[0]?.visible).toBe(false);

      element.renderRoot.children[0]?.dispatchEvent(new Event('transitionend'));

      await updated();
      expect(element.registry[0]).toBeUndefined();
    });

    it('should not be auto-closed if autoClose param equal false', async () => {
      element.open({ autoCloseTime });
      element.open({ autoClose: false });

      await updated();
      vi.advanceTimersByTime(0);

      expect(element.registry[0]?.visible).toBe(true);
      expect(element.registry[1]?.visible).toBe(true);

      vi.advanceTimersByTime(autoCloseTime + 1);
      expect(element.registry[0]?.visible).toBe(false);
      expect(element.registry[1]?.visible).toBe(true);
    });
  });

  describe('auto-close', () => {
    beforeEach(async () => {
      vi.useFakeTimers();
      element = await fixture(html`<fake-component></fake-component>`);
    });

    afterEach(() => {
      vi.clearAllTimers();
    });

    it('should be prevented', async () => {
      await addNotification({ autoCloseTime });
      vi.advanceTimersByTime(0);

      element.renderRoot.children[0]?.dispatchEvent(new Event('mouseenter'));

      vi.advanceTimersByTime(autoCloseTime + 1);
      expect(element.registry[0]?.visible).toBe(true);
    });
  });
});
