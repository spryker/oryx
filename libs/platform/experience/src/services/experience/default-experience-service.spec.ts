import { HttpService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { Injector } from '@spryker-oryx/di';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ContentBackendUrl } from '../experience-tokens';
import { DefaultExperienceService } from './default-experience.service';
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
      content: {
        data: {
          items: [
            {
              title: 'Mock Dynamic component render',
            },
          ],
        },
      },
      options: {
        data: {
          mode: 'carousel',
        },
      },
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

const mockComponentData = {
  id: mockStructureKey,
  type: 'LayoutSlot',
  content: {
    data: {
      items: [
        {
          title: 'Mock Dynamic component render',
        },
      ],
    },
  },
  options: {
    data: {
      mode: 'carousel',
    },
  },
};

describe('DefaultExperienceService', () => {
  let service: ExperienceService;
  let http: HttpTestService;
  let testInjector;

  beforeEach(() => {
    testInjector = new Injector([
      {
        provide: ContentBackendUrl,
        useValue: ContentBackendUrl,
      },
      {
        provide: HttpService,
        useClass: HttpTestService,
      },
      {
        provide: 'ExperienceService',
        useClass: DefaultExperienceService,
      },
    ]);

    service = testInjector.inject('ExperienceService');
    http = testInjector.inject(HttpService) as HttpTestService;
  });

  afterEach(() => {
    http.clear();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultExperienceService);
  });

  describe('getStructure', () => {
    it('should return mock data', () => {
      const callback = vi.fn();

      http.flush(mockStructure);

      service.getComponent({ uid: mockStructureKey }).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockStructure);
    });
    it('should not request second time if key the same', () => {
      const callback = vi.fn();
      const keyTrigger$ = new BehaviorSubject(mockStructureKey);
      const structure$ = keyTrigger$.pipe(
        switchMap((uid) => service.getComponent({ uid }))
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

      http.flush(mockComponentData);

      service.getContent({ uid: mockDataKey }).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockComponentData.content);
    });
    it('should  not request second time if key the same', () => {
      const callback = vi.fn();
      const keyTrigger$ = new BehaviorSubject(mockDataKey);
      const structure$ = keyTrigger$.pipe(
        switchMap((uid) => service.getContent({ uid }))
      );

      http.flush(mockComponentData);
      structure$.subscribe(callback);

      expect(callback).toHaveBeenNthCalledWith(1, mockComponentData.content);

      http.flush('mockNewResponse');

      keyTrigger$.next(mockDataKey);

      expect(callback).toHaveBeenNthCalledWith(2, mockComponentData.content);
    });
  });
});
