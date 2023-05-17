import { fixture, nextFrame } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  HydratableLitElement,
  HYDRATE_ON_DEMAND,
} from '@spryker-oryx/utilities';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { of } from 'rxjs';
import { AppRef } from '../../orchestration/app';
import { DefaultHydrationService } from './default-hydration.service';
import { HydrationService, HydrationTrigger } from './hydration.service';

@customElement('mock-a')
class MockA extends LitElement {
  [HYDRATE_ON_DEMAND] = vi.fn();
}

@customElement('mock-b')
class MockB extends LitElement {
  [HYDRATE_ON_DEMAND] = vi.fn();
}

@customElement('mock-c')
class MockC extends LitElement {
  [HYDRATE_ON_DEMAND] = vi.fn();
}

@customElement('mock-router')
class MockRouter extends LitElement {
  [HYDRATE_ON_DEMAND] = vi.fn();
}

const mockComponentsPlugin = {
  loadComponent: vi.fn(),
};

const mockApp = {
  requirePlugin: vi.fn().mockReturnValue(mockComponentsPlugin),
};

const mockAInitializer = vi.fn().mockReturnValue(of(null));
const mockBInitializer = vi.fn().mockReturnValue(of(null));

describe('DefaultHydrationService', () => {
  let service: HydrationService;

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: HydrationService,
          useClass: DefaultHydrationService,
        },
        {
          provide: AppRef,
          useValue: mockApp,
        },
        {
          provide: HydrationTrigger,
          useFactory: mockAInitializer,
        },
        {
          provide: HydrationTrigger,
          useFactory: mockBInitializer,
        },
      ],
    });
    service = testInjector.inject(HydrationService);
    await fixture(html`
      <mock-a hydratable="click"></mock-a>
      <mock-b></mock-b>
      <mock-c hydratable="click,focusin"></mock-c>
      <mock-router hydratable route="/"></mock-router>
    `);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should call hydration initializers on construction time', () => {
    expect(mockAInitializer).toHaveBeenCalled();
    expect(mockBInitializer).toHaveBeenCalled();
  });

  describe('initHydrateHooks', () => {
    it('should add proper listeners depends on `hydratable` attribute and call `HYDRATE_ON_DEMAND` when these listeners has been triggered', () => {
      const mockA = document.querySelector('mock-a') as HydratableLitElement;
      const mockC = document.querySelector('mock-c') as HydratableLitElement;
      const mockB = document.querySelector('mock-b') as HydratableLitElement;
      service.initHydrateHooks();

      mockA.click();
      expect(mockA[HYDRATE_ON_DEMAND]).toHaveBeenCalled();
      expect(mockC[HYDRATE_ON_DEMAND]).not.toHaveBeenCalled();

      mockC.click();
      expect(mockC[HYDRATE_ON_DEMAND]).toHaveBeenCalledTimes(1);
      mockC.dispatchEvent(new Event('focusin'));
      expect(mockC[HYDRATE_ON_DEMAND]).toHaveBeenCalledTimes(2);

      expect(mockB[HYDRATE_ON_DEMAND]).not.toHaveBeenCalled();
    });

    it('should call loadComponent from component plugin for initialization component', async () => {
      const mockA = document.querySelector('mock-a') as HydratableLitElement;
      service.initHydrateHooks();
      vi.spyOn(window.customElements, 'get').mockReturnValue(undefined);
      vi.spyOn(window.customElements, 'whenDefined');

      mockA.click();
      await nextFrame();
      expect(mockComponentsPlugin.loadComponent).toHaveBeenCalledWith(
        mockA.localName
      );
      expect(mockA[HYDRATE_ON_DEMAND]).toHaveBeenCalled();
      expect(window.customElements.whenDefined).toHaveBeenCalledWith(
        mockA.localName
      );
    });
  });

  describe('hydrateOnDemand', () => {
    it('should call proper methods', async () => {
      const mockA = document.querySelector('mock-a') as HydratableLitElement;
      vi.spyOn(window.customElements, 'get').mockReturnValue(MockA);
      await service.hydrateOnDemand(mockA);
      expect(mockA[HYDRATE_ON_DEMAND]).toHaveBeenCalled();
      expect(mockComponentsPlugin.loadComponent).not.toHaveBeenCalled();
      expect(window.customElements.whenDefined).not.toHaveBeenCalled();

      vi.spyOn(window.customElements, 'get').mockReturnValue(undefined);
      await service.hydrateOnDemand(mockA);
      expect(mockComponentsPlugin.loadComponent).toHaveBeenCalledWith(
        mockA.localName
      );
      expect(mockA[HYDRATE_ON_DEMAND]).toHaveBeenCalled();
      expect(window.customElements.whenDefined).toHaveBeenCalledWith(
        mockA.localName
      );
    });

    it('should do nothing if component does not have hydratable attribute', async () => {
      const mockB = document.querySelector('mock-b') as HydratableLitElement;
      vi.spyOn(window.customElements, 'get').mockReturnValue(undefined);
      await service.hydrateOnDemand(mockB);
      expect(mockB[HYDRATE_ON_DEMAND]).not.toHaveBeenCalled();
      expect(mockComponentsPlugin.loadComponent).not.toHaveBeenCalled();
      expect(window.customElements.whenDefined).not.toHaveBeenCalled();
    });
  });
});
