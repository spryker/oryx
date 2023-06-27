/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Globalize from 'globalize';
import { Mock } from 'vitest';
import { GlobalizeCldrImporter, GlobalizeService } from './globalize.service';

describe('GlobalizeService', () => {
  interface MockGlobalizeStatic extends Mock<any[], any> {
    (): Globalize;
    loadMessages: Mock<any[], any>;
    load: Mock<any[], any>;
    asReal(): Globalize.Static;
  }

  function mockGlobalizeStaticFactory(): MockGlobalizeStatic {
    const mockGlobalize = vi.fn() as MockGlobalizeStatic;
    mockGlobalize.loadMessages = vi.fn();
    mockGlobalize.load = vi.fn();
    mockGlobalize.asReal = () => mockGlobalize as any;

    return mockGlobalize;
  }

  class MockGlobalize implements Pick<Globalize, 'formatMessage'> {
    formatMessage = vi.fn();
    cldr: any;
  }

  function setup(options?: { cldrImporters?: GlobalizeCldrImporter[] }) {
    const globalize = new MockGlobalize();
    const globalizeStatic = mockGlobalizeStaticFactory();
    const globalizeService = new GlobalizeService(
      options?.cldrImporters,
      globalizeStatic.asReal()
    );
    globalizeStatic.mockReturnValue(globalize);

    return { globalizeService, globalizeStatic, globalize };
  }

  describe('loadMessages() method', () => {
    testCldrInit((globalizeService) => globalizeService.loadMessages({}));

    it('should call `GlobalizeStatic.loadMessages()` with data', async () => {
      const { globalizeService, globalizeStatic } = setup();
      const data = { mockData: true } as any;

      await globalizeService.loadMessages(data);

      expect(globalizeStatic.loadMessages).toHaveBeenCalledWith(data);
    });
  });

  describe('formatMessage() method', () => {
    testCldrInit((globalizeService) =>
      globalizeService.formatMessage('locale-id', 'token', { ctx: true } as any)
    );

    testGlobalizeCache((globalizeService, localeId) =>
      globalizeService.formatMessage(localeId, 'token', { ctx: true } as any)
    );

    it('should call `Globalize.formatMessage()` and return result', async () => {
      const { globalizeService, globalize } = setup();
      const ctx = { mockCtx: true };
      globalize.formatMessage.mockReturnValue('mock-result');

      const res = globalizeService.formatMessage(
        'locale-id',
        'token',
        ctx as any
      );

      await expect(res).resolves.toBe('mock-result');
      expect(globalize.formatMessage).toHaveBeenCalledWith('token', ctx);
    });

    it('should transform deep context into flat context', async () => {
      const { globalizeService, globalize } = setup();
      const ctx = { mockCtx: true, deep: { deep2: { deep3: 'value' } } };
      globalize.formatMessage.mockReturnValue('mock-result');

      const res = globalizeService.formatMessage(
        'locale-id',
        'token',
        ctx as any
      );

      await expect(res).resolves.toBe('mock-result');
      expect(globalize.formatMessage).toHaveBeenCalledWith('token', {
        mockCtx: true,
        deepDeep2Deep3: 'value',
      });
    });

    it('should return undefined if `Globalize.formatMessage()` throws', async () => {
      const { globalizeService, globalize } = setup();
      const ctx = { mockCtx: true };
      globalize.formatMessage.mockImplementation(() => {
        throw new Error('Mock Error');
      });

      const res = globalizeService.formatMessage(
        'locale-id',
        'token',
        ctx as any
      );

      await expect(res).resolves.toBe(undefined);
      expect(globalize.formatMessage).toHaveBeenCalledWith('token', ctx);
    });
  });

  describe('resolveLocales() method', () => {
    function setupCldr(options?: { cldr?: any } & Parameters<typeof setup>[0]) {
      const fixture = setup(options);

      fixture.globalize.cldr = options?.cldr ?? { attributes: {} };

      return fixture;
    }

    testCldrInit(
      (globalizeService) => globalizeService.resolveLocales('locale-id'),
      setupCldr
    );

    testGlobalizeCache(
      (globalizeService, localeId) => globalizeService.resolveLocales(localeId),
      setupCldr
    );

    it('should return locales from CLDR globalize data', async () => {
      const cldrAttrs = {
        attributes: {
          minLanguageId: 'mock-min-lang-id',
          maxLanguageId: 'mock-max-lang-id',
          bundle: 'mock-bundle',
        },
      };
      const { globalizeService } = setupCldr({ cldr: cldrAttrs });

      const res = globalizeService.resolveLocales('locale-id');

      await expect(res).resolves.toEqual([
        'root',
        'mock-min-lang-id',
        'mock-max-lang-id',
        'mock-bundle',
      ]);
    });
  });

  describe('addCldrImporter() method', () => {
    it('should add extra CLDR importer when globalize initializes', async () => {
      const { globalizeService, globalizeStatic } = setup({
        cldrImporters: [
          vi.fn().mockResolvedValue('mock-cldr-data1'),
          vi.fn().mockResolvedValue('mock-cldr-data2'),
          vi.fn().mockResolvedValue('mock-cldr-data3'),
        ],
      });
      const cldrImporter = vi.fn().mockResolvedValue('mock-cldr-data4');

      // Trigger globalize init
      await globalizeService.loadMessages({});

      expect(cldrImporter).not.toHaveBeenCalled();
      expect(globalizeStatic.load).toHaveBeenCalledTimes(1);
      expect(globalizeStatic.load).toHaveBeenCalledWith([
        'mock-cldr-data1',
        'mock-cldr-data2',
        'mock-cldr-data3',
      ]);

      globalizeService.addCldrImporter(cldrImporter);

      // Trigger globalize init
      await globalizeService.loadMessages({});

      expect(cldrImporter).toHaveBeenCalledTimes(1);
      expect(globalizeStatic.load).toHaveBeenCalledTimes(2);
      expect(globalizeStatic.load).toHaveBeenCalledWith([
        'mock-cldr-data1',
        'mock-cldr-data2',
        'mock-cldr-data3',
        'mock-cldr-data4',
      ]);
    });
  });

  function testCldrInit(
    initFn: (globalizeService: GlobalizeService) => Promise<any>,
    customSetup = setup
  ) {
    it('should initialize globalize with CLDR data', async () => {
      const cldrImporters = [
        vi.fn().mockResolvedValue('mock-cldr-data1'),
        vi.fn().mockResolvedValue('mock-cldr-data2'),
        vi.fn().mockResolvedValue('mock-cldr-data3'),
      ];
      const { globalizeService, globalizeStatic } = customSetup({
        cldrImporters: cldrImporters,
      });

      await initFn(globalizeService);

      expect(globalizeStatic.load).toHaveBeenCalledWith([
        'mock-cldr-data1',
        'mock-cldr-data2',
        'mock-cldr-data3',
      ]);
    });
  }

  function testGlobalizeCache(
    triggerFn: (
      globalizeService: GlobalizeService,
      localeId: string
    ) => Promise<any>,
    customSetup = setup
  ) {
    it('should create globalize instance for localeId', async () => {
      const { globalizeService, globalizeStatic } = customSetup();

      await triggerFn(globalizeService, 'locale-id');

      expect(globalizeStatic).toHaveBeenCalledWith('locale-id');
      expect(globalizeStatic).toHaveBeenCalledTimes(1);
    });

    it('should cache globalize instances for each localeId', async () => {
      const { globalizeService, globalizeStatic } = customSetup();

      await triggerFn(globalizeService, 'locale-id1');
      await triggerFn(globalizeService, 'locale-id2');
      await triggerFn(globalizeService, 'locale-id3');

      expect(globalizeStatic).toHaveBeenCalledWith('locale-id1');
      expect(globalizeStatic).toHaveBeenCalledWith('locale-id2');
      expect(globalizeStatic).toHaveBeenCalledWith('locale-id3');
      expect(globalizeStatic).toHaveBeenCalledTimes(3);

      await triggerFn(globalizeService, 'locale-id1');
      await triggerFn(globalizeService, 'locale-id2');
      await triggerFn(globalizeService, 'locale-id3');

      expect(globalizeStatic).toHaveBeenCalledTimes(3);
    });

    it('should recreate globalize instances after `loadMessages()` was called', async () => {
      const { globalizeService, globalizeStatic } = customSetup();

      await triggerFn(globalizeService, 'locale-id');

      expect(globalizeStatic).toHaveBeenCalledWith('locale-id');
      expect(globalizeStatic).toHaveBeenCalledTimes(1);

      globalizeService.loadMessages({});
      await triggerFn(globalizeService, 'locale-id');

      expect(globalizeStatic).toHaveBeenCalledTimes(2);
    });

    it('should recreate globalize instances after `addCldrImporter()` was called', async () => {
      const { globalizeService, globalizeStatic } = customSetup();

      await triggerFn(globalizeService, 'locale-id');

      expect(globalizeStatic).toHaveBeenCalledWith('locale-id');
      expect(globalizeStatic).toHaveBeenCalledTimes(1);

      globalizeService.addCldrImporter(vi.fn());
      await triggerFn(globalizeService, 'locale-id');

      expect(globalizeStatic).toHaveBeenCalledTimes(2);
    });
  }
});
