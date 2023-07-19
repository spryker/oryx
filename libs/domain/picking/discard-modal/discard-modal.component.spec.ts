import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { DiscardPickingComponent } from './discard-modal.component';
import { discardModalComponent } from './discard-modal.def';

describe('DiscardModalComponent', () => {
  let element: DiscardPickingComponent;

  beforeAll(async () => {
    await useComponent(discardModalComponent);
  });

  beforeEach(async () => {
    element = await fixture(
      html`<oryx-discard-picking></oryx-discard-picking>`
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
        element.renderRoot
          .querySelector('button')
          ?.dispatchEvent(new MouseEvent('click'));
      });

      it('should close the modal', () => {
        expect(element).not.toContainElement('oryx-modal[open]');
      });
    });
  });
});
