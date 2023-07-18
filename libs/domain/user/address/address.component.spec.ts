import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import {
  Address,
  AddressService,
  AddressStateService,
  CrudState,
} from '@spryker-oryx/user';
import {
  mockCurrentAddress,
  uncompletedAddress,
} from '@spryker-oryx/user/mocks';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { BehaviorSubject, of } from 'rxjs';
import { UserAddressComponent } from './address.component';
import { addressComponent } from './address.def';

class MockAddressService implements Partial<AddressService> {
  get = vi.fn().mockReturnValue(of(mockCurrentAddress));
  getList = vi.fn();
}
class MockRouterService implements Partial<RouterService> {
  currentParams = vi.fn().mockReturnValue(of());
}

const mockState = new BehaviorSubject<{
  action: CrudState;
  selected?: Address | null;
}>({
  action: CrudState.Read,
  selected: null,
});
class MockAddressStateService implements Partial<AddressStateService> {
  set = vi.fn();
  get = vi.fn().mockReturnValue(mockState);
  clear = vi.fn();
}

describe('UserAddressComponent', () => {
  let element: UserAddressComponent;
  let service: MockAddressService;

  beforeAll(async () => {
    await useComponent(addressComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        { provide: AddressService, useClass: MockAddressService },

        {
          provide: AddressStateService,
          useClass: MockAddressStateService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
      ],
    });

    service = testInjector.inject(
      AddressService
    ) as unknown as MockAddressService;

    element = await fixture(html`<oryx-user-address
      addressId="currentaddressid"
    ></oryx-user-address>`);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when address id is not provided', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-user-address></oryx-user-address>`);
    });

    it('should not render inner content', () => {
      expect(element.renderRoot.textContent).not.toContain(
        mockCurrentAddress.firstName
      );
    });
  });

  describe('when no address', () => {
    beforeEach(async () => {
      service.get.mockReturnValue(of(null));

      element = await fixture(
        html`<oryx-user-address
          addressId="currentaddressid"
        ></oryx-user-address>`
      );
    });

    it('should not render inner content', () => {
      expect(element.renderRoot.textContent).not.toContain(
        mockCurrentAddress.firstName
      );
    });
  });

  describe('when address is rendered', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address
          addressId="currentaddressid"
        ></oryx-user-address>`
      );
    });

    it('should render content', () => {
      expect(element.renderRoot.textContent).toContain(
        mockCurrentAddress.salutation
      );
    });

    describe('and custom schema is provided', () => {
      const schema = '{{firstName}} test';
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-user-address
            addressId="currentaddressid"
            .options=${{ schema }}
          ></oryx-user-address>`
        );
      });

      it('should render content by schema', () => {
        expect(element.renderRoot.textContent).toContain('test');
      });

      describe('and schema starts with text content', () => {
        const schema = 'start {{firstName}}';
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-user-address
              addressId="currentaddressid"
              .options=${{ schema }}
            ></oryx-user-address>`
          );
        });

        it('should render the schema properly', () => {
          expect(element.renderRoot.textContent).toContain('start');
        });
      });

      describe('and schema is array', () => {
        const schema = ['{{firstName}}', '{{lastName}}'];
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-user-address
              addressId="currentaddressid"
              .options=${{ schema }}
            ></oryx-user-address>`
          );
        });

        it('should convert schema into the string', () => {
          expect(element.renderRoot.textContent).toContain(
            `${mockCurrentAddress.firstName} ${mockCurrentAddress.lastName}`
          );
        });
      });

      describe('and schema contains includable condition', () => {
        describe('and condition field is presented', () => {
          const schema = '{{#firstName}}condition{{/firstName}}';
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-user-address
                addressId="currentaddressid"
                .options=${{ schema }}
              ></oryx-user-address>`
            );
          });

          it('should render conditional part', () => {
            expect(element.renderRoot.textContent?.trim()).toContain(
              'condition'
            );
          });
        });

        describe('and condition field is missed', () => {
          const schema = '{{#fakeField}}should render{{/fakeField}}';
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-user-address
                addressId="currentaddressid"
                .options=${{ schema }}
              ></oryx-user-address>`
            );
          });

          it('should not render conditional part', () => {
            expect(element.renderRoot.textContent?.trim()).not.toContain(
              'condition'
            );
          });
        });

        describe('and condition start and end of condition are mismatched', () => {
          const schema = '{{#firstName}}condition{{/firstName1}}';
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-user-address
                addressId="currentaddressid"
                .options=${{ schema }}
              ></oryx-user-address>`
            );
          });

          it('should not replace the conditional part', () => {
            expect(element.renderRoot.textContent).toContain(schema);
          });
        });
      });

      describe('and schema contains excludable condition', () => {
        describe('and condition field is presented', () => {
          const schema = '{{^firstName}}condition{{/firstName}}';
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-user-address
                addressId="currentaddressid"
                .options=${{ schema }}
              ></oryx-user-address>`
            );
          });

          it('should not render conditional part', () => {
            expect(element.renderRoot.textContent?.trim()).not.toContain(
              'condition'
            );
          });
        });

        describe('and condition field is missed', () => {
          const schema = '{{^fakeField}}condition{{/fakeField}}';
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-user-address
                addressId="currentaddressid"
                .options=${{ schema }}
              ></oryx-user-address>`
            );
          });

          it('should render conditional part', () => {
            expect(element.renderRoot.textContent?.trim()).toContain(
              'condition'
            );
          });
        });
      });
    });
  });

  describe('when is multiline', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address
          addressId="currentaddressid"
          .options=${{ multiline: true }}
        ></oryx-user-address>`
      );
    });

    it('should render paragraphs', () => {
      expect(element).toContainElement('p');
    });

    describe('and custom schema is provided', () => {
      const schema = ['{{firstName}}', '{{lastName}}'];
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-user-address
            addressId="currentaddressid"
            .options=${{ schema, multiline: true }}
          ></oryx-user-address>`
        );
      });

      it('should render content by schema', () => {
        expect(element.renderRoot.querySelectorAll('p').length).toBe(2);
      });

      describe('and schema is string', () => {
        const schema = '{{firstName}} test';
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-user-address
              addressId="currentaddressid"
              .options=${{ schema, multiline: true }}
            ></oryx-user-address>`
          );
        });

        it('should render converted schema', () => {
          const p = element.renderRoot.querySelector('p');
          expect(p?.textContent).toContain('test');
        });
      });

      describe('and no matches', () => {
        const schema = '{{fakeField}}';
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-user-address
              addressId="currentaddressid"
              .options=${{ schema, multiline: true }}
            ></oryx-user-address>`
          );
        });

        it('should not render the paragraph', () => {
          expect(element).not.toContainElement('p');
        });
      });
    });
  });

  describe('when some data is missed', () => {
    beforeEach(async () => {
      service.get.mockReturnValue(of(uncompletedAddress));

      element = await fixture(
        html`<oryx-user-address
          addressId="uncompleted"
          .options=${{ multiline: true }}
        ></oryx-user-address>`
      );
    });

    it('should skip missed parts', () => {
      const firstParagraph = element.renderRoot.querySelector('p');
      expect(
        firstParagraph?.textContent
          ?.trim()
          ?.indexOf(uncompletedAddress.firstName as string)
      ).toBe(0);
    });
  });
});
