import { HttpService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector, Injector } from '@spryker-oryx/di';
import { NEVER, of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { ContentBackendUrl } from '../experience-tokens';
import { RouterEventType, RouterService } from '../router';
import { DataTransmitterService } from './data-transmitter/data-transmitter.service';
import { ExperienceService } from './experience.service';
import {
  POST_MESSAGE_TYPE,
  PreviewExperienceService,
  REQUEST_MESSAGE_TYPE,
} from './preview-experience.service';

class MockRouterService implements Partial<RouterService> {
  go = vi.fn().mockReturnValue({});
  getEvents = vi.fn().mockReturnValue(NEVER);
}

class MockDataTransmitterService implements DataTransmitterService {
  initialize = vi.fn();
}

describe('ExperiencePreviewService', () => {
  let service: PreviewExperienceService;
  let testInjector: Injector;

  beforeEach(() => {
    testInjector = createInjector({
      providers: [
        {
          provide: ExperienceService,
          useClass: PreviewExperienceService,
        },
        {
          provide: ContentBackendUrl,
          useValue: ContentBackendUrl,
        },
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: DataTransmitterService,
          useClass: MockDataTransmitterService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
      ],
    });
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when router is not set', () => {
    beforeEach(() => {
      service = testInjector.inject(
        ExperienceService
      ) as PreviewExperienceService;
    });

    it('should be provided', () => {
      expect(service).toBeInstanceOf(PreviewExperienceService);
    });

    it('should get route data', async () =>
      await new Promise<void>((done) => {
        const routeValue = '/';

        window?.postMessage(
          {
            type: POST_MESSAGE_TYPE,
            route: routeValue,
          },
          '*'
        );

        service.getRouteData().subscribe((route) => {
          expect(route).toBe(routeValue);

          done();
        });
      }));

    it('should get interactive data', async () =>
      await new Promise<void>((done) => {
        const interactionValue = {
          action: 'test',
          componentId: '1',
        };

        window?.postMessage(
          {
            type: POST_MESSAGE_TYPE,
            interaction: interactionValue,
          },
          '*'
        );

        service.getInteractionData().subscribe((interaction) => {
          expect(interaction).toBeTruthy();
          expect(interaction?.action).toBe(interactionValue.action);
          expect(interaction?.componentId).toBe(interactionValue.componentId);

          done();
        });
      }));

    it('should send post message to reload structure', async () =>
      await new Promise<void>((done) => {
        const structure = 'test';

        window?.addEventListener(
          'message',
          (e: MessageEvent) => {
            expect(e.data.structure).toBe(structure);
            expect(e.data.type).toBe(REQUEST_MESSAGE_TYPE);

            done();
          },
          { once: true }
        );

        service.getComponent({ uid: structure });
      }));

    it('should send post message to reload content', async () =>
      await new Promise<void>((done) => {
        const content = 'test';

        window?.addEventListener(
          'message',
          (e: MessageEvent) => {
            expect(e.data.content).toBe(content);
            expect(e.data.type).toBe(REQUEST_MESSAGE_TYPE);

            done();
          },
          { once: true }
        );

        service.getContent({ uid: content });
      }));

    it('should get structure data', async () =>
      await new Promise<void>((done) => {
        const structure = {
          id: '/',
          type: 'Page',
          components: [
            {
              id: '1',
              type: 'Banner',
            },
            {
              id: '2',
              type: 'Slider',
            },
          ],
        };

        service.getComponent({ uid: structure.id }).subscribe((data) => {
          expect(data.type).toBe(structure.type);
          expect(data.components?.length).toBe(structure.components.length);

          done();
        });

        window.postMessage(
          {
            type: POST_MESSAGE_TYPE,
            structure,
          },
          '*'
        );
      }));

    it('should get content data', async () =>
      await new Promise<void>((done) => {
        const content = {
          id: '1',
          data: {
            title: 'textarea title text1',
          },
        };

        service.getContent({ uid: content.id }).subscribe((data) => {
          expect(data.data.title).toBe(content.data.title);

          done();
        });

        window.postMessage(
          {
            type: POST_MESSAGE_TYPE,
            content,
          },
          '*'
        );
      }));
  });

  describe('when router is set', () => {
    it('should send post message', async () =>
      await new Promise<void>((done) => {
        (
          testInjector.inject(RouterService).getEvents as unknown as SpyInstance
        ).mockReturnValue(
          of({
            type: RouterEventType.NavigationEnd,
            route: '/',
          })
        );
        testInjector.inject(ExperienceService);
        window?.addEventListener(
          'message',
          (e: MessageEvent) => {
            expect(e.data.route).toBe('/');
            expect(e.data.type).toBe(REQUEST_MESSAGE_TYPE);

            done();
          },
          { once: true }
        );
      }));
  });
});
