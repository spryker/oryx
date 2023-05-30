import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { html } from 'lit';
import { DiscardModalComponent } from './discard-modal.component';
import { discardModalComponent } from './discard-modal.def';

describe('DiscardModalComponent', () => {
  let element: DiscardModalComponent;

  beforeAll(async () => {
    await useComponent(discardModalComponent);
  });

  beforeEach(async () => {
    element = await fixture(html`<oryx-discard-modal></oryx-discard-modal>`);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render modal', () => {
    expect(element.renderRoot.querySelector('oryx-modal')).not.toBeNull();
  });

  describe('when modal is opened', () => {
    beforeEach(() => {
      element.open = true;
    });

    it('modal should have opened attribute', () => {
      expect(
        element.renderRoot.querySelector('oryx-modal')?.hasAttribute('open')
      ).toBe(true);
    });

    describe('and when modal is closed', () => {
      beforeEach(() => {
        element.dispatchEvent(new CustomEvent('oryx.close'));
      });

      it('should close modal when it emits oryx.close event', () => {
        element.addEventListener('oryx.close', () => {
          expect(
            element.renderRoot.querySelector('oryx-modal')?.hasAttribute('open')
          ).toBe(false);
        });
      });

      it('should close modal when close button is clicked', async () => {
        const closeButton: HTMLButtonElement | null =
          element.renderRoot?.querySelector('button') ?? null;
        closeButton?.click();

        await element.updateComplete;

        expect(
          element.renderRoot.querySelector('oryx-modal')?.hasAttribute('open')
        ).toBe(false);
      });
    });
  });
});
