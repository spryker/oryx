import { fixture } from '@open-wc/testing-helpers';
import { mockAuthProviders } from '@spryker-oryx/auth/mocks';
import * as core from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import * as experience from '@spryker-oryx/experience';
import { mockOrderProviders } from '@spryker-oryx/order/mocks';
import * as litRxjs from '@spryker-oryx/utilities';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { OrderConfirmationBannerComponent } from './confirmation-banner.component';
import { orderConfirmationBannerComponent } from './confirmation-banner.def';

const mockId = 'mockid';

const mockContent = {
  getOptions: vi.fn().mockReturnValue(of({})),
  getContent: vi.fn().mockReturnValue(of({})),
};

const mockContext = {
  get: vi.fn().mockReturnValue(of(mockId)),
  provide: vi.fn(),
};

const mockObserve = {
  get: vi.fn(),
};

vi.spyOn(experience, 'ContentController') as SpyInstance;
(experience.ContentController as unknown as SpyInstance).mockReturnValue(
  mockContent
);

vi.spyOn(core, 'ContextController') as SpyInstance;
(core.ContextController as unknown as SpyInstance).mockReturnValue(mockContext);

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
    createInjector({
      providers: [...mockOrderProviders, ...mockAuthProviders],
    });
    element = await fixture(
      html`<oryx-order-confirmation-banner></oryx-order-confirmation-banner>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render oryx image', () => {
    expect(element).toContainElement('oryx-image');
  });

  it('should render orderId', () => {
    const p =
      element.renderRoot.querySelector<HTMLParagraphElement>('section + p');
    expect(p?.textContent).toContain(mockId);
  });
});
