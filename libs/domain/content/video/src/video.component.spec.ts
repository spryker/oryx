import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ExperienceService } from '@spryker-oryx/experience';
import { siteProviders } from '@spryker-oryx/site';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { ContentVideoComponent } from './video.component';
import { contentVideoComponent } from './video.def';
import { ContentVideoOptions } from './video.model';

class MockService {
  getOptions(): Observable<ContentVideoOptions> {
    return of({});
  }
}

describe('ContentVideoComponent', () => {
  let element: ContentVideoComponent;

  beforeAll(async () => {
    await useComponent(contentVideoComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: ExperienceService,
          useClass: MockService,
        },
        ...siteProviders,
      ],
    });

    element = await fixture(html`<oryx-content-video></oryx-content-video>`);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(ContentVideoComponent);
  });

  describe(`when options are not provided`, () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-video .options=${{ src: 'test.mp4' }}>
        </oryx-content-video>`
      );
    });

    it(`should render video element with autoplay, playsInline, loop and muted`, () => {
      expect(element).toContainElement(
        `oryx-video[autoplay][playsInline][loop][muted]`
      );
    });
  });

  ['muted', 'playsInline', 'controls', 'loop', 'autoplay'].forEach((option) => {
    describe(`when ${option} is set to true`, () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-content-video
            .options=${{ [option]: true, src: 'test.mp4' }}
          ></oryx-content-video>`
        );
      });

      it(`should render video element with ${option}`, () => {
        expect(element).toContainElement(`oryx-video[${option}]`);
      });
    });

    describe(`when ${option} is set to false`, () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-content-video
            .options=${{ [option]: false, src: 'test.mp4' }}
          ></oryx-content-video>`
        );
      });

      it(`should render video element with ${option}`, () => {
        expect(element).not.toContainElement(`oryx-video[${option}]`);
      });
    });
  });
});
