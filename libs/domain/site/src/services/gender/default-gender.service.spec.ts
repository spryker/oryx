import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Observable } from 'rxjs';
import { DefaultGenderService } from './default-gender.service';
import { GenderService } from './gender.service';

describe('DefaultGenderService', () => {
  let service: GenderService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: GenderService,
          useClass: DefaultGenderService,
        },
      ],
    });

    service = testInjector.inject(GenderService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('get', () => {
    it('should return an observable', () => {
      expect(service.get()).toBeInstanceOf(Observable);
    });

    it('should return a list of genders', () => {
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
