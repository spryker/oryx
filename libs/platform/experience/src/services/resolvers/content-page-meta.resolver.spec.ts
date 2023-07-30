import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { of } from 'rxjs';
import { ExperienceDataService } from '../experience';
import { ContentPageMetaResolver } from './content-page-meta.resolver';

const mockRouter = {
  currentRoute: vi.fn(),
};

const mockExperienceDataService = {
  getData: vi.fn(),
};

describe('ContentPageMetaResolver', () => {
  let service: ContentPageMetaResolver;

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: ContentPageMetaResolver,
          useClass: ContentPageMetaResolver,
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
    vi.resetAllMocks();
  });

  describe('getScore', () => {
    it('should return proper value if content exist', () => {
      const callback = vi.fn();
      mockExperienceDataService.getData.mockReturnValue([
        {
          meta: { route: '/product/:id' },
        },
      ]);
      service = getInjector().inject(ContentPageMetaResolver);
      mockRouter.currentRoute.mockReturnValue(of('/product/123'));
      service.getScore().subscribe(callback);
      expect(callback).toHaveBeenCalledWith([{ route: '/product/:id' }]);
    });

    it('should return proper value if content is not exist', () => {
      const callback = vi.fn();
      mockExperienceDataService.getData.mockReturnValue([
        {
          meta: { route: '/category/:id' },
        },
      ]);
      service = getInjector().inject(ContentPageMetaResolver);
      mockRouter.currentRoute.mockReturnValue(of('/product/123'));
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
          },
        },
      ]);
      service = getInjector().inject(ContentPageMetaResolver);
      mockRouter.currentRoute.mockReturnValue(of('/product/123'));

      service.resolve().subscribe(callback);
      expect(callback).toHaveBeenCalledWith({
        robots: 'follow,noindex',
        title: 'title',
        description: 'description',
      });
    });
  });
});
