import {
  App,
  AppRef,
  FeatureFlagsService,
  ResourcePlugin,
} from '@spryker-oryx/core';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { DataTransmitterService } from './data-transmitter.service';
import {
  DataIds,
  DefaultDataTransmitterService,
  REQUEST_FLAGS_MESSAGE_TYPE,
  REQUEST_RESOURCES_MESSAGE_TYPE,
} from './default-data-transmitter.service';

class MockApp implements Partial<App> {
  findPlugin = vi.fn();
}

class MockFeatureFlagsService implements Partial<FeatureFlagsService> {
  getFlags = vi.fn();
}

const getService = <T>(token: string) =>
  getInjector().inject(token) as unknown as T;

describe('DataTransmitterService', () => {
  let service: DataTransmitterService;

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: DataTransmitterService,
          useClass: DefaultDataTransmitterService,
        },
        {
          provide: AppRef,
          useClass: MockApp,
        },
        {
          provide: FeatureFlagsService,
          useClass: MockFeatureFlagsService,
        },
      ],
    });

    service = getInjector().inject(DataTransmitterService);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('initialize', () => {
    it('should send `REQUEST_RESOURCES_MESSAGE_TYPE` post message', async () =>
      await new Promise<void>((done) => {
        const mockResources = {
          graphics: {
            a: {},
            b: {},
            c: {},
          },
        };
        const app = getService<MockApp>(AppRef);
        app.findPlugin.mockReturnValue({
          getResources: () => mockResources,
        });
        service.initialize();
        window?.addEventListener('message', (e: MessageEvent) => {
          if (
            e.data.type === REQUEST_RESOURCES_MESSAGE_TYPE &&
            e.data[DataIds.Graphics].length
          ) {
            expect(e.data[DataIds.Graphics]).toEqual(
              Object.keys(mockResources.graphics)
            );
            done();
          }
        });
        expect(app.findPlugin).toHaveBeenCalledWith(ResourcePlugin);
      }));

    it('should send `REQUEST_FLAGS_MESSAGE_TYPE` post message', async () =>
      await new Promise<void>((done) => {
        const mockFlags = {
          global: {
            a: 'a',
          },
          b: {
            b: 'b',
          },
        };
        const flagsService =
          getService<MockFeatureFlagsService>(FeatureFlagsService);
        flagsService.getFlags.mockReturnValue(mockFlags);
        service.initialize();
        window?.addEventListener('message', (e: MessageEvent) => {
          if (
            e.data.type === REQUEST_FLAGS_MESSAGE_TYPE &&
            e.data[DataIds.Flags]
          ) {
            expect(e.data[DataIds.Flags]).toEqual(mockFlags);
            done();
          }
        });
      }));
  });
});
