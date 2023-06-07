import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { CrudState } from '../../models';
import { AddressStateService } from './address-state.service';
import { DefaultAddressStateService } from './default-address-state.service';

describe('DefaultAddressStateService', () => {
  let service: AddressStateService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: AddressStateService,
          useClass: DefaultAddressStateService,
        },
      ],
    });

    service = testInjector.inject(AddressStateService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultAddressStateService);
  });

  describe('when the action is set', () => {
    beforeEach(() => {
      service.set(CrudState.Update);
    });

    it('should return the action state', () => {
      service.get().subscribe((state) => {
        expect(state.action).toBe(CrudState.Update);
      });
    });

    describe('and the state is cleared', () => {
      beforeEach(() => {
        service.clear();
      });

      it('should return the default state (Read)', () => {
        service.get().subscribe((state) => {
          expect(state.action).toBe(CrudState.Read);
          expect(state.selected).toBeNull();
        });
      });
    });
  });

  describe('when the selected address is set', () => {
    beforeEach(() => {
      service.set(CrudState.Read, 'foo');
    });

    it('should return the selected address ID', () => {
      service.get().subscribe((state) => {
        expect(state.selected).toBe('foo');
      });
    });

    describe('and the state is cleared', () => {
      beforeEach(() => {
        service.clear();
      });

      it('should return the default state (Read)', () => {
        service.get().subscribe((state) => {
          expect(state.action).toBe(CrudState.Read);
          expect(state.selected).toBeNull();
        });
      });
    });
  });
});
