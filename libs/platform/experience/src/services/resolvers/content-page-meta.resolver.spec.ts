import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { RouteConfig } from '@spryker-oryx/router/lit';
import { of } from 'rxjs';
import { ExperienceDataService, ExperienceService } from '../experience';
import { ContentPageMetaResolver } from './content-page-meta.resolver';

const mockRouteConfig: RouteConfig = {
  path: '/mock',
  type: 'mock',
};

const mockRouter = {
  currentRoute: vi.fn().mockReturnValue(of('/product/123')),
  current: vi.fn().mockReturnValue(of(mockRouteConfig)),
};

const mockExperienceDataService = {
  getData: vi.fn(),
};

const mockExperienceService = {
  getComponent: vi.fn().mockReturnValue(of({})),
};

describe('ContentPageMetaResolver', () => {
  let service: ContentPageMetaResolver;

  beforeEach(() => {
    mockFeatureVersion('1.4');
    createInjector({
      providers: [
        {
          provide: ContentPageMetaResolver,
          useClass: ContentPageMetaResolver,
        },
        {
          provide: ExperienceService,
          useValue: mockExperienceService,
        },
        {
          provide: RouterService,
          useValue: mockRouter,
        },
        {
          provide: ExperienceDataService,
          useValue: mockExperienceDataService,
        },
      ],
    });
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('getScore', () => {
    it('should return proper value if content exist', () => {
      const callback = vi.fn();
      mockExperienceDataService.getData.mockReturnValue([
        {
          meta: { routeType: 'mock' },
        },
      ]);
      service = getInjector().inject(ContentPageMetaResolver);
      service.getScore().subscribe(callback);
      expect(callback).toHaveBeenCalledWith([{ routeType: 'mock' }]);
    });

    it('should return proper value if content is not exist', () => {
      const callback = vi.fn();
      mockExperienceDataService.getData.mockReturnValue([
        {
          meta: { routeType: 'mock1' },
        },
      ]);
      service = getInjector().inject(ContentPageMetaResolver);
      service.getScore().subscribe(callback);
      expect(callback).toHaveBeenCalledWith([undefined]);
    });
  });

  describe('resolve', () => {
    it('should return proper object', () => {
      const callback = vi.fn();
      mockExperienceDataService.getData.mockReturnValue([
        {
          meta: {
            route: '/product/:id',
            follow: true,
            index: false,
            title: 'title',
            description: 'description',
            routeType: 'mock',
          },
        },
      ]);
      service = getInjector().inject(ContentPageMetaResolver);

      service.resolve().subscribe(callback);
      expect(callback).toHaveBeenCalledWith({
        robots: 'follow,noindex',
        title: 'title',
        description: 'description',
        routeType: 'mock',
      });
    });
  });
});
