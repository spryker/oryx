import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { mockPickingListData } from '@spryker-oryx/picking/mocks';
import { PickingListService } from '@spryker-oryx/picking/services';
import { ButtonColor, ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { i18n, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { afterEach, beforeAll, beforeEach } from 'vitest';
import { PickingCustomerNoteModalComponent } from './customer-note-modal.component';
import { pickingCustomerNoteModalComponent } from './customer-note-modal.def';

class MockPickingListService implements Partial<PickingListService> {
  getList = vi.fn().mockReturnValue(of(mockPickingListData[0]));
  getUpcomingPickingListId = vi.fn().mockReturnValue(of(null));
}

const note = mockPickingListData[0].cartNote;
const id = mockPickingListData[0].id;

describe('PickingCustomerNoteModal', () => {
  let element: PickingCustomerNoteModalComponent;
  let service: MockPickingListService;

  beforeAll(async () => {
    await useComponent([pickingCustomerNoteModalComponent]);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: PickingListService,
          useClass: MockPickingListService,
        },
      ],
    });

    service = testInjector.inject<MockPickingListService>(PickingListService);

    element = await fixture(
      html`<oryx-picking-customer-note-modal
        pickingListId=${id}
      ></oryx-picking-customer-note-modal>`
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render order`s cart note', () => {
    expect(element?.renderRoot.textContent?.trim()).toContain(note);
  });

  it('should render the trigger with proper attributes', () => {
    const button = element.renderRoot.querySelector('oryx-button');
    expect(button).not.toBe(null);
    expect(button?.getAttribute('type')).toBe(ButtonType.Icon);
    expect(button?.getAttribute('label')).toBe(
      i18n('oryx.picking.customer-note')
    );
    expect(button?.getAttribute('icon')).toBe(IconTypes.Info);
  });

  it('should render the modal', () => {
    expect(element).toContainElement(
      'oryx-modal[enableFooter][footerButtonFullWidth][minimal]'
    );
  });

  it('should render the header', () => {
    expect(element).toContainElement('oryx-heading h2');
    expect(
      element.renderRoot.querySelector('oryx-heading h2')?.textContent
    ).toContain(i18n('picking-lists.customer-note.customer-note'));
  });

  it('should render the modal`s button with proper attributes', () => {
    const button = element.renderRoot.querySelector(
      'oryx-button[slot="footer"]'
    );
    expect(button).not.toBe(null);
    expect(button?.getAttribute('color')).toBe(ButtonColor.Primary);
    expect(button?.getAttribute('size')).toBe(ButtonSize.Md);
    expect(button?.getAttribute('icon')).toBe(IconTypes.Check);
    expect(button?.getAttribute('text')).toBe(
      i18n('picking-lists.customer-note.got-it')
    );
  });

  describe('and trigger is clicked', () => {
    beforeEach(() => {
      element.renderRoot
        .querySelector('oryx-button')
        ?.dispatchEvent(new MouseEvent('click'));
    });

    it('should open the modal', () => {
      expect(element).toContainElement('oryx-modal[open]');
    });

    describe('and modal`s button is clicked', () => {
      beforeEach(() => {
        element.renderRoot
          .querySelector('oryx-button[slot]')
          ?.dispatchEvent(new MouseEvent('click'));
      });

      it('should closes the modal', () => {
        expect(element).toContainElement('oryx-modal:not([open])');
      });
    });
  });

  describe('when trigger is hidden', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-picking-customer-note-modal
          pickingListId=${id}
          hideTrigger
        ></oryx-picking-customer-note-modal>`
      );
    });

    it('should not render the trigger', () => {
      expect(element).not.toContainElement('oryx-button:not([slot])');
    });
  });

  describe('when order does not contain cart note', () => {
    beforeEach(async () => {
      service.getList = vi.fn().mockReturnValue(of(mockPickingListData[1]));
      element = await fixture(
        html`<oryx-picking-customer-note-modal
          pickingListId=${mockPickingListData[1].id}
        ></oryx-picking-customer-note-modal>`
      );
    });

    it('should not render the content', () => {
      expect(element).not.toContainElement('oryx-modal, oryx-button');
    });
  });
});
