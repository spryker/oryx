import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { IndexedDbEntities } from '../entities.provider';
import { DexieIndexedDbConfig } from './dexie-config.provider';
import { DexieIndexedDbService } from './dexie-indexed-db.service';

const mockDexieIndexedDbConfig = {};

const mockIndexedDbEntities = {
  collect: vi.fn(),
};

const callback = vi.fn();

const mockDexieVersions = {
  stores: vi.fn(),
  upgrade: vi.fn(),
};

const mockDexieMethods = {
  open: vi.fn(),
  on: vi.fn(),
  close: vi.fn(),
  version: vi.fn(() => mockDexieVersions),
};

const mockSchemaMetadata = {
  collect: vi.fn(),
};

const mockNavigator = {
  storage: {
    persisted: vi.fn(),
    persist: vi.fn(),
  },
};

const mockMetadataGroup = [
  {
    version: 'a',
    metadata: [class A {}],
  },
  {
    version: 'b',
    metadata: [class B {}],
  },
];

vi.mock('dexie', () => ({
  Dexie: class {
    open = () => mockDexieMethods.open();
    on = () => mockDexieMethods.on();
    version = () => mockDexieMethods.version();
    close = () => mockDexieMethods.close();
  },
}));

vi.mock('../schema-metadata.ts', () => ({
  IndexedDbSchemaMetadata: class {
    static collect = () =>
      mockSchemaMetadata.collect.mockReturnValue(mockMetadataGroup)();
  },
}));

describe('DefaultExperienceService', () => {
  let service: DexieIndexedDbService;

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: IndexedDbEntities,
          useValue: mockIndexedDbEntities,
        },
        {
          provide: DexieIndexedDbConfig,
          useValue: mockDexieIndexedDbConfig,
        },
        {
          provide: 'DEV',
          useValue: false,
        },
        {
          provide: DexieIndexedDbService,
          useClass: DexieIndexedDbService,
        },
      ],
    });

    vi.stubGlobal('navigator', mockNavigator);
    service = getInjector().inject(DexieIndexedDbService);
  });

  afterEach(() => {
    destroyInjector();
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  describe('registerEntities', () => {
    it('should return undefined', () => {
      service
        .registerEntities([
          class {
            data = ['data'];
          },
        ])
        .subscribe(callback);
      expect(callback).toHaveBeenCalledWith(void 0);
    });
  });

  describe('getDb', () => {
    it('should OryxDexieDb database', () => {
      mockNavigator.storage.persist.mockReturnValue(true);

      service.getDb().subscribe(callback);
      expect(callback).toHaveBeenCalledWith(void 0);
    });
  });
});
