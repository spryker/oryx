import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { ExperienceDataRevealer } from './data-client.service';
import { DefaultExperienceDataClientService } from './default-data-client.service';

const mockExperienceDataRevealerA = {
  reveal: vi.fn().mockReturnValue(of(null)),
};

const mockExperienceDataRevealerB = {
  reveal: vi.fn().mockReturnValue(of(null)),
};

describe('ExperienceDataClientService', () => {
  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: DefaultExperienceDataClientService,
          useClass: DefaultExperienceDataClientService,
        },
        {
          provide: ExperienceDataRevealer,
          useValue: mockExperienceDataRevealerA,
        },
        {
          provide: ExperienceDataRevealer,
          useValue: mockExperienceDataRevealerB,
        },
      ],
    });
    vi.spyOn(window.parent, 'postMessage');
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('initialize', () => {
    it('should call ExperienceDataRevealer.reveal', async () => {
      getInjector()
        .inject(DefaultExperienceDataClientService)
        .initialize()
        .subscribe();
      expect(mockExperienceDataRevealerA.reveal).toHaveBeenCalled();
      expect(mockExperienceDataRevealerB.reveal).toHaveBeenCalled();
    });
  });
});
