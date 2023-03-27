import { fixture, html } from '@open-wc/testing-helpers';
import { AlertType } from '@spryker-oryx/ui';
import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { RegistryController } from './registry.controller';

@customElement('fake-component')
class FakeComponent extends LitElement {
  controller = new RegistryController(this);
}

describe('RegistryController', () => {
  let element: FakeComponent;

  beforeEach(async () => {
    vi.useFakeTimers();
    element = await fixture(html`<fake-component></fake-component>`);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('when a notification is added', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-component></fake-component>`);
      element.controller.add({ content: 'test' });
    });

    it('should add a key', async () => {
      const entries = element.controller.getItems();
      expect(entries[0]?.key).not.toBeNull();
    });

    it('should make the item initially visible', async () => {
      const entries = element.controller.getItems();
      expect(entries[0]?.visible).toBeUndefined();
    });

    describe('and when time has passed by', () => {
      beforeEach(async () => {
        vi.advanceTimersByTime(0);
      });

      it('should remove the item', async () => {
        const entries = element.controller.getItems();
        expect(entries[0]?.visible).toBe(true);
      });
    });
  });

  describe('when the notification floating is undefined', () => {
    beforeEach(async () => {
      element.controller.add({});
    });

    it('should set floating by default', async () => {
      const entries = element.controller.getItems();
      expect(entries[0]?.floating).toBe(true);
    });
  });

  describe('when the notification floating is false', () => {
    beforeEach(async () => {
      element.controller.add({ floating: false });
    });

    it('should keep floating false', async () => {
      const entries = element.controller.getItems();
      expect(entries[0]?.floating).toBe(false);
    });
  });

  describe('when the notification is not closable and autoclose is false', () => {
    beforeEach(async () => {
      element.controller.add({ autoClose: false, closable: false });
    });

    it('should set it to closable by default', async () => {
      const entries = element.controller.getItems();
      expect(entries[0]?.closable).toBe(true);
    });
  });

  describe('when the notification type is success', () => {
    beforeEach(async () => {
      element.controller.add({ type: AlertType.Success });
    });

    it('should set it to autoclose', async () => {
      const entries = element.controller.getItems();
      expect(entries[0]?.autoClose).toBe(true);
    });
  });

  describe('when the notification type is info', () => {
    beforeEach(async () => {
      element.controller.add({ type: AlertType.Info });
    });

    it('should set it to autoclose', async () => {
      const entries = element.controller.getItems();
      expect(entries[0]?.autoClose).toBe(true);
    });
  });

  describe('when the notification type is error', () => {
    beforeEach(async () => {
      element.controller.add({ type: AlertType.Error });
    });

    it('should set it to autoclose', async () => {
      const entries = element.controller.getItems();
      expect(entries[0]?.autoClose).toBe(false);
    });
  });

  describe('when the notification type is warning', () => {
    beforeEach(async () => {
      element.controller.add({ type: AlertType.Warning });
    });

    it('should set it to autoclose', async () => {
      const entries = element.controller.getItems();
      expect(entries[0]?.autoClose).toBe(false);
    });
  });

  describe('when a notification has autoclose', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-component></fake-component>`);
      element.controller.add({ autoClose: true, autoCloseTime: 1000 });
    });

    it('should add the item', async () => {
      const entries = element.controller.getItems();
      expect(entries[0]?.key).not.toBeNull();
    });

    describe('and when the autoclose time is passed by', () => {
      beforeEach(async () => {
        vi.advanceTimersByTime(1000);
      });

      it('should make the item invisible', async () => {
        const entries = element.controller.getItems();
        expect(entries[0]?.visible).toBe(false);
      });
    });

    describe('and when the DESTROY_DELAY_TIME time is passed by', () => {
      beforeEach(async () => {
        vi.advanceTimersByTime(1600);
      });

      it('should remove the item', async () => {
        const entries = element.controller.getItems();
        expect(entries.length).toBe(0);
      });
    });
  });
});
