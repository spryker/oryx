import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { PickingInProgressModalComponent } from './picking-in-progress.component';
import { pickingInProgressModalComponent } from './picking-in-progress.def';

describe('PickingInProgressModalComponent', () => {
  let element: PickingInProgressModalComponent;

  beforeAll(async () => {
    await useComponent(pickingInProgressModalComponent);
  });

  beforeEach(async () => {
    element = await fixture(
      html`<oryx-picking-picking-in-progress-modal></oryx-picking-picking-in-progress-modal>`
    );
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
        element.renderRoot?.querySelector<HTMLElement>('oryx-button')?.click();
        await element.updateComplete;

        expect(
          element.renderRoot.querySelector('oryx-modal')?.hasAttribute('open')
        ).toBe(false);
      });
    });
  });
});
