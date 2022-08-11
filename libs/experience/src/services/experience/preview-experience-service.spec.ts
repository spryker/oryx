import { HttpService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { Injector } from '@spryker-oryx/injector';
import { NEVER, of } from 'rxjs';
import { CONTENT_BACKEND_URL } from '../experience-tokens';
import { RouterEventType, RouterService } from '../router';
import { DefaultExperienceService } from './default-experience.service';
import {
  POST_MESSAGE_TYPE,
  PreviewExperienceService,
  REQUEST_MESSAGE_TYPE,
} from './preview-experience.service';

class MockRouterService implements Partial<RouterService> {
  go = () => ({});
  getEvents = (type: RouterEventType) => NEVER;
}

class MockRouterServiceActive implements Partial<RouterService> {
  go = () => ({});
  getEvents = (type: RouterEventType) =>
    of({
      type: RouterEventType.NavigationEnd,
      route: '/',
    });
}

const providers = [
  {
    provide: 'ExperiencePreviewService',
    useClass: PreviewExperienceService,
  },
  {
    provide: CONTENT_BACKEND_URL,
    useValue: CONTENT_BACKEND_URL,
  },
  {
    provide: HttpService,
    useClass: HttpTestService,
  },
  {
    provide: 'ExperienceService',
    useClass: DefaultExperienceService,
  },
];

beforeAll(() => {
  Object.defineProperty(window, 'parent', {
    value: window,
    configurable: true,
  });
});

describe('ExperiencePreviewService', () => {
  let service: PreviewExperienceService;

  beforeEach(() => {
    const testInjector = new Injector([
      {
        provide: RouterService,
        useClass: MockRouterService,
      },
      ...providers,
    ]);

    service = testInjector.inject('ExperiencePreviewService');
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

describe('ExperiencePreviewService', () => {
  it('should send post message after route set', async () =>
    await new Promise<void>((done) => {
      window?.addEventListener(
        'message',
        (e: MessageEvent) => {
          expect(e.data.route).toBe('/');
          expect(e.data.type).toBe(REQUEST_MESSAGE_TYPE);

          done();
        },
        { once: true }
      );

      const testInjector = new Injector([
        {
          provide: RouterService,
          useClass: MockRouterServiceActive,
        },
        ...providers,
      ]);

      testInjector.inject('ExperiencePreviewService');
    }));
});
