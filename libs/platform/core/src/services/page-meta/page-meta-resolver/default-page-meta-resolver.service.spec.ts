import { nextFrame } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { PageMetaService } from '../page-meta.service';
import { DefaultPageMetaResolverService } from './default-page-meta-resolver.service';
import { ResolverScore } from './page-meta-resolver.model';
import {
  PageMetaResolver,
  PageMetaResolverService,
} from './page-meta-resolver.service';

const mockResolverA = {
  getScore: vi.fn(),
  resolve: vi.fn(),
};

const mockResolverB = {
  getScore: vi.fn(),
  resolve: vi.fn(),
};

const mockResolverC = {
  getScore: vi.fn(),
  resolve: vi.fn(),
};

const mockMetaService = {
  add: vi.fn(),
};

describe('DefaultPageMetaResolverService', () => {
  let service: PageMetaResolverService;

  beforeEach(() => {
    vi.resetAllMocks();
    const testInjector = createInjector({
      providers: [
        {
          provide: PageMetaResolverService,
          useClass: DefaultPageMetaResolverService,
        },
        {
          provide: PageMetaResolver,
          useValue: mockResolverA,
        },
        {
          provide: PageMetaResolver,
          useValue: mockResolverB,
        },
        {
          provide: PageMetaResolver,
          useValue: mockResolverC,
        },
        {
          provide: PageMetaService,
          useValue: mockMetaService,
        },
      ],
    });

    service = testInjector.inject(PageMetaResolverService);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('initialize', () => {
    it('should call PageMetaService.add with proper data', async () => {
      mockResolverA.getScore.mockReturnValue(of(ResolverScore.Default));
      mockResolverA.resolve.mockReturnValue(
        of({
          title: 'A',
          'og:meta': 'a',
        })
      );
      mockResolverB.getScore.mockReturnValue(of(2));
      mockResolverB.resolve.mockReturnValue(
        of({
          title: 'b',
          'og:meta': 'b',
          'og:img': 'a',
        })
      );
      mockResolverC.getScore.mockReturnValue(of(ResolverScore.NotUsed));
      mockResolverC.resolve.mockReturnValue(
        of({
          title: 'C',
        })
      );

      service.initialize();
      await nextFrame();

      expect(mockMetaService.add).toHaveBeenCalledWith([
        { name: 'title', attrs: { text: 'b' } },
        { name: 'og:meta', attrs: { content: 'b' } },
        { name: 'og:img', attrs: { content: 'a' } },
      ]);
    });
  });

  describe('getTitle', () => {
    it('should return title', async () => {
      const callback = vi.fn();
      mockResolverA.getScore.mockReturnValue(of(ResolverScore.Default));
      mockResolverA.resolve.mockReturnValue(
        of({
          title: 'A',
        })
      );
      mockResolverB.getScore.mockReturnValue(of(3));
      mockResolverB.resolve.mockReturnValue(
        of({
          title: 'B',
        })
      );
      mockResolverC.getScore.mockReturnValue(of(2));
      mockResolverC.resolve.mockReturnValue(
        of({
          title: 'C',
        })
      );

      service.getTitle().subscribe(callback);
      await nextFrame();
      expect(callback).toHaveBeenCalledWith('B');
    });
  });
});
