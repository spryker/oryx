import { HttpService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { Injector } from '@spryker-oryx/injector';
import { NEVER, of } from 'rxjs';
import { beforeEach } from 'vitest';
import { CONTENT_BACKEND_URL } from '../experience-tokens';
import { RouterEventType, RouterService } from '../router';
import { DefaultExperienceService } from './default-experience.service';
import {
  ExperiencePreviewService,
  POST_MESSAGE_TYPE,
  REQUEST_MESSAGE_TYPE,
} from './experience-preview.service';

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
    useClass: ExperiencePreviewService,
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

describe('ExperiencePreviewService', () => {
  let service: ExperiencePreviewService;

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
    expect(service).toBeInstanceOf(ExperiencePreviewService);
  });

  it('should get route data', (done) => {
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
  });

  it('should get interaction data', (done) => {
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
  });

  it('should send post message to reload structure', (done) => {
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

    service.getStructure({ key: structure });
  });

  it('should send post message to reload content', (done) => {
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

    service.getContent({ key: content });
  });

  it('should get structure data', (done) => {
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

    service.getStructure({ key: structure.id }).subscribe((data) => {
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
  });

  it('should get content data', (done) => {
    const content = {
      id: '1',
      data: {
        title: 'textarea title text1',
      },
    };

    service.getContent({ key: content.id }).subscribe((data) => {
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
  });
});

describe('ExperiencePreviewService', () => {
  it('should send post message after route set', (done) => {
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
  });
});
