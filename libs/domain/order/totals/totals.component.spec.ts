import { fixture } from '@open-wc/testing-helpers';
import { mockAuthProviders } from '@spryker-oryx/auth/mocks';
import * as core from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import * as experience from '@spryker-oryx/experience';
import { mockOrderProviders } from '@spryker-oryx/order/mocks';
import * as litRxjs from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { OrderTotalsComponent } from './totals.component';
import { orderTotalsComponent } from './totals.def';

const mockContent = {
  getOptions: vi.fn().mockReturnValue(of({})),
  getContent: vi.fn().mockReturnValue(of({})),
};

const mockContext = {
  get: vi.fn().mockReturnValue(of('mockid')),
  provide: vi.fn(),
};

const mockObserve = {
  get: vi.fn(),
};

const setupControllerSpies = (): void => {
  vi.spyOn(experience, 'ContentController') as SpyInstance;
  (experience.ContentController as unknown as SpyInstance).mockReturnValue(
    mockContent
  );

  vi.spyOn(core, 'ContextController') as SpyInstance;
  (core.ContextController as unknown as SpyInstance).mockReturnValue(
    mockContext
  );

  vi.spyOn(litRxjs, 'ObserveController') as SpyInstance;
  (litRxjs.ObserveController as unknown as SpyInstance).mockReturnValue(
    mockObserve
  );
};

setupControllerSpies();

describe('OrderTotalsComponent', () => {
  let element: OrderTotalsComponent;

  beforeAll(async () => {
    await useComponent([orderTotalsComponent]);
  });

  beforeEach(async () => {
    createInjector({
      providers: [...mockOrderProviders, ...mockAuthProviders],
    });
    element = await fixture(html`<oryx-order-totals></oryx-order-totals>`);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('is defined', async () => {
    expect(element).toBeInstanceOf(OrderTotalsComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
