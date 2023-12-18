import { DefaultQueryService, QueryService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { ContentAdapter, ContentConfig } from './adapter';
import { ContentService } from './content.service';
import { DefaultContentService } from './default-content.service';

const mockContentAdapterA = {
  get: vi.fn(),
  getAll: vi.fn(),
};

const mockContentAdapterB = {
  get: vi.fn(),
  getAll: vi.fn(),
};

const mockContentAdapterC = {
  get: vi.fn(),
  getAll: vi.fn(),
};

describe('DefaultContentService', () => {
  let service: ContentService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ContentService,
          useClass: DefaultContentService,
        },
        {
          provide: `${ContentAdapter}a`,
          useValue: mockContentAdapterA,
        },
        {
          provide: `${ContentAdapter}b`,
          useValue: mockContentAdapterB,
        },
        {
          provide: `${ContentAdapter}c`,
          useValue: mockContentAdapterC,
        },
        {
          provide: QueryService,
          useClass: DefaultQueryService,
        },
        {
          provide: ContentConfig,
          useValue: {
            a: {
              types: ['a', 'both', 'all'],
            },
            b: {
              types: ['b', 'both', 'all'],
            },
            c: {
              types: ['c', 'all'],
            },
          },
        },
      ],
    });

    service = testInjector.inject(ContentService);
  });

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
  });

  describe('get', () => {
    it('should return an observable with a content from `a` adapter', async () => {
      const callback = vi.fn();
      const qualifier = { id: '123', entities: ['a'] };
      mockContentAdapterA.get.mockReturnValue(of({ name: 'adapter 123' }));
      service.get(qualifier).subscribe(callback);
      expect(mockContentAdapterA.get).toHaveBeenCalledWith(qualifier);
      expect(callback).toHaveBeenNthCalledWith(1, { name: 'adapter 123' });
    });

    it('should return an observable with a content from `b` adapter', async () => {
      const callback = vi.fn();
      const qualifier = { id: '321', entities: ['b'] };
      mockContentAdapterB.get.mockReturnValue(of({ name: 'adapter 321' }));
      service.get(qualifier).subscribe(callback);
      expect(mockContentAdapterB.get).toHaveBeenCalledWith(qualifier);
      expect(callback).toHaveBeenCalledWith({ name: 'adapter 321' });
    });

    it('should return an observable with a content from both adapters and return merged value', async () => {
      const callback = vi.fn();
      const qualifier = { id: '123', entities: ['both'] };
      mockContentAdapterA.get.mockReturnValue(of({ nameA: 'adapter 123' }));
      mockContentAdapterB.get.mockReturnValue(of({ nameB: 'adapter 321' }));
      service.get(qualifier).subscribe(callback);
      expect(mockContentAdapterA.get).toHaveBeenCalledWith(qualifier);
      expect(mockContentAdapterB.get).toHaveBeenCalledWith(qualifier);
      expect(callback).toHaveBeenCalledWith({
        nameA: 'adapter 123',
        nameB: 'adapter 321',
      });
    });

    describe('when entities is not defined', () => {
      it('should return an observable with a content from both adapters and return merged value', async () => {
        const callback = vi.fn();
        const qualifier = { id: '123' };
        mockContentAdapterA.get.mockReturnValue(of({ nameA: 'adapter 123' }));
        mockContentAdapterB.get.mockReturnValue(of({ nameB: 'adapter 321' }));
        mockContentAdapterC.get.mockReturnValue(of({ nameC: 'adapter 213' }));
        service.get(qualifier).subscribe(callback);
        expect(mockContentAdapterA.get).toHaveBeenCalledWith(qualifier);
        expect(mockContentAdapterB.get).toHaveBeenCalledWith(qualifier);
        expect(callback).toHaveBeenCalledWith({
          nameA: 'adapter 123',
          nameB: 'adapter 321',
          nameC: 'adapter 213',
        });
      });
    });
  });

  describe('getAll', () => {
    it('should return an observable with array of contents from proper adapters', async () => {
      const callback = vi.fn();
      const qualifier = { id: '123', entities: ['a', 'b'] };
      mockContentAdapterA.getAll.mockReturnValue(
        of([{ nameA: 'adapter 123', id: 'A' }])
      );
      mockContentAdapterB.getAll.mockReturnValue(
        of([{ nameB: 'adapter 321', id: 'B' }])
      );
      service.getAll(qualifier).subscribe(callback);
      expect(mockContentAdapterA.getAll).toHaveBeenCalledWith(qualifier);
      expect(mockContentAdapterB.getAll).toHaveBeenCalledWith(qualifier);
      expect(callback).toHaveBeenCalledWith([
        { nameA: 'adapter 123', id: 'A' },
        { nameB: 'adapter 321', id: 'B' },
      ]);
    });

    it('should return an observable with array of contents from all adapters', async () => {
      const callback = vi.fn();
      const qualifier = { id: '123', entities: ['all'] };
      mockContentAdapterA.getAll.mockReturnValue(
        of([{ nameA: 'adapter 123' }])
      );
      mockContentAdapterB.getAll.mockReturnValue(
        of([{ nameB: 'adapter 321' }])
      );
      mockContentAdapterC.getAll.mockReturnValue(
        of([{ nameC: 'adapter 213' }])
      );
      service.getAll(qualifier).subscribe(callback);
      expect(mockContentAdapterA.getAll).toHaveBeenCalledWith(qualifier);
      expect(mockContentAdapterB.getAll).toHaveBeenCalledWith(qualifier);
      expect(mockContentAdapterC.getAll).toHaveBeenCalledWith(qualifier);
      expect(callback).toHaveBeenCalledWith([
        { nameA: 'adapter 123' },
        { nameB: 'adapter 321' },
        { nameC: 'adapter 213' },
      ]);
    });
  });
});
