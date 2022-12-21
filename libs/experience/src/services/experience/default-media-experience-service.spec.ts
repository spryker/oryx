import { App, AppRef, ResourcePlugin } from '@spryker-oryx/core';
import {
  createInjector,
  destroyInjector,
  Injector,
} from '@spryker-oryx/injector';
import { SpyInstance } from 'vitest';
import {
  DefaultMediaExperienceService,
  MediaIds,
  REQUEST_RESOURCES_MESSAGE_TYPE,
} from './default-media-experience-service';
import { MediaExperienceService } from './media-experience-service';

class MockApp implements Partial<App> {
  findPlugin = vi.fn();
}

describe('DefaultMediaExperienceService', () => {
  let service: DefaultMediaExperienceService;
  let testInjector: Injector;

  beforeEach(() => {
    testInjector = createInjector({
      providers: [
        {
          provide: MediaExperienceService,
          useClass: DefaultMediaExperienceService,
        },
        {
          provide: AppRef,
          useClass: MockApp,
        },
      ],
    });
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('initialize', () => {
    it('should send post message', async () =>
      await new Promise<void>((done) => {
        const mockResources = {
          graphics: {
            a: {},
            b: {},
            c: {},
          },
        };

        const app = testInjector.inject(AppRef);
        (app.findPlugin as unknown as SpyInstance).mockReturnValue({
          getResources: () => mockResources,
        });
        service = testInjector.inject(
          MediaExperienceService
        ) as DefaultMediaExperienceService;
        service.initialize();

        window?.addEventListener(
          'message',
          (e: MessageEvent) => {
            expect(e.data[MediaIds.Graphics]).toEqual(
              Object.keys(mockResources.graphics)
            );
            expect(e.data.type).toBe(REQUEST_RESOURCES_MESSAGE_TYPE);

            done();
          },
          { once: true }
        );

        expect(app.findPlugin).toHaveBeenCalledWith(ResourcePlugin);
      }));
  });
});
