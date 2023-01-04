import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Observable } from 'rxjs';
import { DefaultSalutationService } from './default-salutation.service';
import { SalutationService } from './salutation.service';

describe('DefaultSalutationService', () => {
  let service: SalutationService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: SalutationService,
          useClass: DefaultSalutationService,
        },
      ],
    });

    service = testInjector.inject(SalutationService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('get', () => {
    it('should return an observable', () => {
      expect(service.get()).toBeInstanceOf(Observable);
    });

    it('should return a list of salutations', () => {
      service.get().subscribe((s) =>
        expect(s).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              text: expect.any(String),
              value: expect.any(String),
            }),
          ])
        )
      );
    });
  });
});
