import { fixture, nextFrame } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  HYDRATE_ON_DEMAND,
  PatchableLitElement,
} from '@spryker-oryx/utilities';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { AppRef } from '../../orchestration';
import {
  DefaultHydrateService,
  hydrateAllEvent,
  locationHydrationEvent,
} from './default-hydrate.service';
import { HydrateService } from './hydrate.service';

vi.mock('lit', async () => {
  const actual = (await vi.importActual('lit')) as Record<string, unknown>;
  return { ...actual, isServer: false };
});

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
  findPlugin: vi.fn().mockReturnValue(mockComponentsPlugin),
};

describe('DefaultHydrateService', () => {
  let service: HydrateService;
  let element: any;

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: HydrateService,
          useClass: DefaultHydrateService,
        },
        {
          provide: AppRef,
          useValue: mockApp,
        },
      ],
    });
    service = testInjector.inject(HydrateService);
    element = await fixture(html`
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

  it('should add router listeners and hydrate proper component when it is needed', async () => {
    const mockRouter = document.querySelector(
      'mock-router '
    ) as PatchableLitElement;

    document.dispatchEvent(
      new CustomEvent(locationHydrationEvent, {
        composed: true,
        bubbles: true,
      })
    );
    // Skip initial event
    expect(mockRouter[HYDRATE_ON_DEMAND]).not.toHaveBeenCalled();
    document.dispatchEvent(
      new CustomEvent(locationHydrationEvent, {
        composed: true,
        bubbles: true,
      })
    );
    expect(mockRouter[HYDRATE_ON_DEMAND]).toHaveBeenCalledWith(true);
  });

  describe('initHydrateHooks', () => {
    it('should add proper listeners depends on `hydratable` attribute and call `HYDRATE_ON_DEMAND` when these listeners has been triggered', () => {
      const mockA = document.querySelector('mock-a') as PatchableLitElement;
      const mockC = document.querySelector('mock-c') as PatchableLitElement;
      const mockB = document.querySelector('mock-b') as PatchableLitElement;
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

    it('should add force all listener and call `HYDRATE_ON_DEMAND` for all components when listener has been triggered', () => {
      const mockA = document.querySelector('mock-a') as PatchableLitElement;
      const mockC = document.querySelector('mock-c') as PatchableLitElement;
      const mockB = document.querySelector('mock-b') as PatchableLitElement;
      service.initHydrateHooks();

      expect(mockC[HYDRATE_ON_DEMAND]).not.toHaveBeenCalled();
      expect(mockB[HYDRATE_ON_DEMAND]).not.toHaveBeenCalled();
      expect(mockA[HYDRATE_ON_DEMAND]).not.toHaveBeenCalled();

      document.dispatchEvent(
        new CustomEvent(hydrateAllEvent, {
          composed: true,
          bubbles: true,
        })
      );

      expect(mockC[HYDRATE_ON_DEMAND]).toHaveBeenCalled();
      expect(mockB[HYDRATE_ON_DEMAND]).not.toHaveBeenCalled();
      expect(mockA[HYDRATE_ON_DEMAND]).toHaveBeenCalled();
    });

    it('should call loadComponent from component plugin for initialization component', async () => {
      const mockA = document.querySelector('mock-a') as PatchableLitElement;
      service.initHydrateHooks();
      vi.spyOn(window.customElements, 'get').mockReturnValue(undefined);
      vi.spyOn(window.customElements, 'upgrade');

      mockA.click();
      await nextFrame();
      expect(mockComponentsPlugin.loadComponent).toHaveBeenCalledWith(
        mockA.localName
      );
      expect(mockA[HYDRATE_ON_DEMAND]).toHaveBeenCalled();
      expect(window.customElements.upgrade).toHaveBeenCalledWith(mockA);
    });
  });

  describe('hydrateOnDemand', () => {
    it('should call proper methods', async () => {
      const mockA = document.querySelector('mock-a') as PatchableLitElement;
      vi.spyOn(window.customElements, 'get').mockReturnValue(mockA);
      await service.hydrateOnDemand(mockA);
      expect(mockA[HYDRATE_ON_DEMAND]).toHaveBeenCalled();
      expect(mockComponentsPlugin.loadComponent).not.toHaveBeenCalled();
      expect(window.customElements.upgrade).not.toHaveBeenCalled();

      vi.spyOn(window.customElements, 'get').mockReturnValue(undefined);
      await service.hydrateOnDemand(mockA);
      expect(mockComponentsPlugin.loadComponent).toHaveBeenCalledWith(
        mockA.localName
      );
      expect(mockA[HYDRATE_ON_DEMAND]).toHaveBeenCalled();
      expect(window.customElements.upgrade).toHaveBeenCalledWith(mockA);
    });

    it('should do nothing if component does not have hydratable attribute', async () => {
      const mockB = document.querySelector('mock-b') as PatchableLitElement;
      vi.spyOn(window.customElements, 'get').mockReturnValue(undefined);
      await service.hydrateOnDemand(mockB);
      expect(mockB[HYDRATE_ON_DEMAND]).not.toHaveBeenCalled();
      expect(mockComponentsPlugin.loadComponent).not.toHaveBeenCalled();
      expect(window.customElements.upgrade).not.toHaveBeenCalled();
    });
  });
});
