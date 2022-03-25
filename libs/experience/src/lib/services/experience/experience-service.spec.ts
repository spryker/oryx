import { CoreServices } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { Injector } from '@spryker-oryx/injector';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ExperienceService } from './experience.service';

const mockStructureKey = 'bannerSlider';
const mockDataKey = 'homepage-banner';

const mockStructure = {
  id: mockStructureKey,
  type: 'LayoutSlot',
  components: [
    {
      id: 'homepage-banner',
      type: 'Banner',
    },
    {
      id: 'bannerSlider2',
      type: 'LayoutSlot',
      components: [
        {
          id: 'category-banner',
          type: 'Banner',
        },
        {
          id: 'bannerSlider3',
          type: 'LayoutSlot',
          components: [
            {
              id: 'homepage-banner',
              type: 'Banner',
            },
          ],
        },
      ],
    },
  ],
};

const mockContent = {
  items: [
    {
      title: 'Mock Dynamic component render',
    },
  ],
};

describe('ExperienceService', () => {
  let service: ExperienceService;
  let http: HttpTestService;
  let testInjector;

  beforeEach(() => {
    testInjector = new Injector([
      {
        provide: 'CONTENT_BACKEND_URL',
        useValue: 'CONTENT_BACKEND_URL',
      },
      {
        provide: CoreServices.Http,
        useClass: HttpTestService,
      },
      {
        provide: 'ExperienceService',
        useClass: ExperienceService,
      },
    ]);

    service = testInjector.inject('ExperienceService');
    http = testInjector.inject(CoreServices.Http) as any;
  });

  afterEach(() => {
    http.clear();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(ExperienceService);
  });

  describe('getStructure', () => {
    it('should return mock data', () => {
      const callback = vi.fn();

      http.flush(mockStructure);

      service.getStructure({ key: mockStructureKey }).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockStructure);
    });
    it('should not request second time if key the same', () => {
      const callback = vi.fn();
      const keyTrigger$ = new BehaviorSubject(mockStructureKey);
      const structure$ = keyTrigger$.pipe(
        switchMap((key) => service.getStructure({ key }))
      );

      http.flush(mockStructure);
      structure$.subscribe(callback);

      expect(callback).toHaveBeenNthCalledWith(1, mockStructure);

      http.flush('mockNewResponse');

      keyTrigger$.next(mockStructureKey);

      expect(callback).toHaveBeenNthCalledWith(2, mockStructure);
    });
  });

  describe('getContent', () => {
    it('should return mock data', () => {
      const callback = vi.fn();

      http.flush(mockContent);

      service.getContent({ key: mockDataKey }).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockContent);
    });
    it('should  not request second time if key the same', () => {
      const callback = vi.fn();
      const keyTrigger$ = new BehaviorSubject(mockDataKey);
      const structure$ = keyTrigger$.pipe(
        switchMap((key) => service.getContent({ key }))
      );

      http.flush(mockContent);
      structure$.subscribe(callback);

      expect(callback).toHaveBeenNthCalledWith(1, mockContent);

      http.flush('mockNewResponse');

      keyTrigger$.next(mockDataKey);

      expect(callback).toHaveBeenNthCalledWith(2, mockContent);
    });
  });
});
