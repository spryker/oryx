import { fixture } from '@open-wc/testing-helpers';
import * as core from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import * as litRxjs from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { OrderConfirmationBannerComponent } from './confirmation-banner.component';
import { orderConfirmationBannerComponent } from './confirmation-banner.def';

const mockContext = {
  get: vi.fn().mockReturnValue(of('mockid')),
  provide: vi.fn(),
};

vi.spyOn(core, 'ContextController') as SpyInstance;
(core.ContextController as unknown as SpyInstance).mockReturnValue(mockContext);

const mockObserve = {
  get: vi.fn(),
};
vi.spyOn(litRxjs, 'ObserveController') as SpyInstance;
(litRxjs.ObserveController as unknown as SpyInstance).mockReturnValue(
  mockObserve
);

describe('OrderConfirmationBannerComponent', () => {
  let element: OrderConfirmationBannerComponent;

  beforeAll(async () => {
    await useComponent([orderConfirmationBannerComponent]);
  });

  beforeEach(async () => {
    element = await fixture(
      html`<oryx-order-confirmation-banner></oryx-order-confirmation-banner>`
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render oryx image', () => {
    expect(element).toContainElement('oryx-image');
  });

  it('should render order-id', () => {
    expect(element?.shadowRoot?.innerHTML).toContain('mockid');
  });
});
