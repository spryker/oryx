import { nextFrame } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { IndexedDbEntities } from '../entities.provider';
import { IndexedDbEntityType } from '../models';
import { DexieIndexedDbConfig } from './dexie-config.provider';
import { DexieIndexedDbService } from './dexie-indexed-db.service';

const mockDexieIndexedDbConfig = {};

const mockIndexedDbEntities = {
  collect: vi.fn(),
};

const callback = vi.fn();

const mockSchemaMetadata = {
  collect: vi.fn(),
};

const mockNavigator = {
  storage: {
    persisted: vi.fn(),
    persist: vi.fn(),
  },
};

const entityA = class A {
  static migration = vi.fn();
  static entityType = {
    name: 'classA',
  };
  static primaryKey = {
    migration: vi.fn(),
    propPath: 'primaryKeyA',
  };
  static indexes = [
    {
      migration: vi.fn(),
      propPath: 'indexA',
      autoIncrement: true,
    },
    {
      migration: vi.fn(),
      propPath: 'indexC',
      multiEntry: true,
    },
  ];
};
const enityB = class B {
  static migration = vi.fn();
  static primaryKey = {
    migration: vi.fn(),
    propPath: 'primaryKeyB',
  };
  static storeName = 'classB';
  static indexes = [
    {
      migration: vi.fn(),
      propPath: 'indexB',
      unique: true,
    },
  ];
};

const mockMetadataGroup = [
  {
    version: 'a',
    metadata: [entityA],
  },
  {
    version: 'b',
    metadata: [enityB],
  },
];

const mockDexieVersions = {
  stores: vi.fn(),
  upgrade: vi.fn(),
};

const mockDexieMethods = {
  open: vi.fn(),
  on: vi.fn(),
  close: vi.fn(),
  version: vi.fn(),
  table: vi.fn(),
};

vi.mock('dexie', () => ({
  Dexie: class {
    open = () => mockDexieMethods.open();
    on = (...data: unknown[]) => mockDexieMethods.on(...data);
    table = (...data: unknown[]) => mockDexieMethods.table(...data);
    version = (data: unknown) =>
      mockDexieMethods.version.mockReturnValue(mockDexieVersions)(data);
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

    mockNavigator.storage.persist.mockReturnValue(true);
    mockDexieMethods.version.mockReturnValue(mockDexieVersions);
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
    it('should return OryxDexieDb database', () => {
      service.getDb().subscribe((db) => {
        Object.keys(mockDexieMethods).forEach((key) => {
          expect(db[key as keyof typeof db]).toBeTruthy();
        });
      });
    });

    it('should initialize database', async () => {
      mockDexieVersions.upgrade.mockImplementation((fn) => fn());
      service.getDb().subscribe();
      await nextFrame();
      expect(mockNavigator.storage.persist).toHaveBeenCalled();
      expect(mockNavigator.storage.persisted).toHaveBeenCalled();
      mockMetadataGroup.forEach((metagroup) => {
        expect(mockDexieMethods.version).toHaveBeenCalledWith(
          metagroup.version
        );
        expect(mockDexieVersions.stores).toHaveBeenCalledWith(
          metagroup.version === 'a'
            ? {
                classa: 'primaryKeyA,++indexA,*indexC',
              }
            : {
                classB: 'primaryKeyB,&indexB',
              }
        );
        expect(mockDexieVersions.upgrade).toHaveBeenCalled();
        expect(metagroup.metadata[0].primaryKey.migration).toHaveBeenCalled();
        expect(metagroup.metadata[0].migration).toHaveBeenCalled();
        expect(metagroup.metadata[0].indexes[0].migration).toHaveBeenCalled();
      });
      expect(mockDexieMethods.open).toHaveBeenCalled();
    });
  });

  describe('onPopulate', () => {
    it('should add callback and call it on `populate` event', async () => {
      const populateCb = vi.fn();
      mockDexieMethods.on.mockImplementation((type, fn) => fn());
      service.onPopulate(populateCb);
      service.getDb().subscribe();
      await nextFrame();
      expect(mockDexieMethods.on).toHaveBeenCalledWith(
        'populate',
        expect.anything()
      );
      expect(populateCb).toHaveBeenCalled();
    });
  });

  describe('getStoreName', () => {
    it('should return store name', async () => {
      expect(service.getStoreName(entityA)).toBe('_a');
      expect(
        service.getStoreName(
          class C {
            static migration = vi.fn();
            // @ts-ignore
            public static get name() {
              return 'classC';
            }
          }
        )
      ).toBe('classc');
    });
  });

  describe('getStore', () => {
    it('should return store name', async () => {
      mockDexieMethods.table.mockReturnValue('tableResult');
      service
        .getStore({
          migration: vi.fn(),
          name: 'classC',
        } as unknown as IndexedDbEntityType)
        .subscribe(callback);
      await nextFrame();
      expect(mockDexieMethods.table).toHaveBeenCalledWith('classc');
      expect(callback).toHaveBeenCalledWith('tableResult');
    });
  });
});
