import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { PickingDiscardModalComponent } from './discard-modal.component';
import { pickingDiscardModalComponent } from './discard-modal.def';

describe('DiscardModalComponent', () => {
  let element: PickingDiscardModalComponent;

  beforeAll(async () => {
    await useComponent(pickingDiscardModalComponent);
  });

  beforeEach(async () => {
    element = await fixture(
      html`<oryx-picking-discard-modal></oryx-picking-discard-modal>`
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render modal', () => {
    expect(element).toContainElement('oryx-modal');
  });

  describe('when modal is opened', () => {
    beforeEach(() => {
      element.open = true;
    });

    it('modal should have opened attribute', () => {
      expect(element).toContainElement('oryx-modal[open]');
    });

    describe('and close button is clicked', () => {
      beforeEach(() => {
        element.renderRoot.querySelector<HTMLElement>('oryx-button')?.click();
      });

      it('should close the modal', () => {
        expect(element).not.toContainElement('oryx-modal[open]');
      });
    });
  });
});
