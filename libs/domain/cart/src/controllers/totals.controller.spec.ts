import {
  TotalsContext,
  TotalsController,
  TotalsService,
} from '@spryker-oryx/cart';
import * as core from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LitElement } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';

const totalsContext = 'mock';

const mockContext = {
  get: vi.fn().mockReturnValue(of(totalsContext)),
  provide: vi.fn(),
};

const mockThis = { addController: vi.fn() } as unknown as LitElement;

class MockTotalsService implements Partial<TotalsService> {
  get = vi.fn().mockReturnValue(of(null));
}

vi.spyOn(core, 'ContextController') as SpyInstance;
(core.ContextController as unknown as SpyInstance).mockReturnValue(mockContext);

describe('TotalsController', () => {
  let service: TotalsService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: TotalsService,
          useClass: MockTotalsService,
        },
      ],
    });

    service = testInjector.inject<MockTotalsService>(TotalsService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('provideContext(', () => {
    describe('when context is provided', () => {
      beforeEach(() => {
        new TotalsController(mockThis).provideContext('mock');
      });

      it('should pass provided context to the provide method', () => {
        expect(mockContext.provide).toHaveBeenCalledWith(
          TotalsContext.Reference,
          totalsContext
        );
      });
    });

    describe('when context is not provided', () => {
      beforeEach(() => {
        new TotalsController(mockThis).provideContext();
      });

      it('should not call the provide method', () => {
        expect(mockContext.provide).not.toHaveBeenCalled();
      });
    });
  });

  describe('getTotals(', () => {
    describe('when context is provided', () => {
      beforeEach(() => {
        new TotalsController(mockThis).getTotals().subscribe();
      });

      it('should get the context', () => {
        expect(mockContext.get).toHaveBeenCalledWith(TotalsContext.Reference);
      });

      it('should pas the context and host to the service get the totals', () => {
        expect(service.get).toHaveBeenCalledWith({
          totalsContext,
          contextElement: mockThis,
        });
      });
    });
  });
});
