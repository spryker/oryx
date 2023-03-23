import { HttpService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ContentBackendUrl } from '../experience-tokens';
import { DefaultExperienceService } from './default-experience.service';
import { ExperienceService } from './experience.service';
import { provideExperienceData } from './static-data';

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

const mockStatic = {
  type: 'Page',
  components: [{ type: 'pageA' }, { type: 'pageB' }],
};

describe('DefaultExperienceService', () => {
  let service: ExperienceService;
  let http: HttpTestService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
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
        provideExperienceData(mockStatic),
      ],
    });

    service = testInjector.inject('ExperienceService');
    http = testInjector.inject(HttpService) as HttpTestService;
  });

  afterEach(() => {
    destroyInjector();
    http.clear();
  });

  it('should parse static data and add ids', () => {
    const callback = vi.fn();
    service.getComponent({ uid: 'static0' }).subscribe(callback);
    expect(callback).toHaveBeenCalledWith(expect.objectContaining(mockStatic));
    service.getComponent({ uid: 'static2' }).subscribe(callback);
    expect(callback).toHaveBeenCalledWith({
      ...mockStatic.components[1],
      id: 'static2',
    });
  });

  describe('getComponent', () => {
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

  describe('getOptions', () => {
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

  describe('getOptions', () => {
    it('should return mock data', () => {
      const callback = vi.fn();
      http.flush(mockComponentData);
      service.getOptions({ uid: mockDataKey }).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(mockComponentData.options);
    });

    it('should  not request second time if key the same', () => {
      const callback = vi.fn();
      const keyTrigger$ = new BehaviorSubject(mockDataKey);
      const structure$ = keyTrigger$.pipe(
        switchMap((uid) => service.getOptions({ uid }))
      );

      http.flush(mockComponentData);
      structure$.subscribe(callback);
      expect(callback).toHaveBeenNthCalledWith(1, mockComponentData.options);

      http.flush('mockNewResponse');
      keyTrigger$.next(mockDataKey);
      expect(callback).toHaveBeenNthCalledWith(2, mockComponentData.options);
    });
  });
});
