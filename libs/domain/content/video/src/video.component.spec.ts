import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ExperienceService } from '@spryker-oryx/experience';
import { siteProviders } from '@spryker-oryx/site';
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

  describe(`when no options are not provided`, () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-video .options=${{ src: 'test.mp4' }}>
        </oryx-content-video>`
      );
    });

    it(`should render video element with autoplay, playsInline, loop and muted`, () => {
      expect(element).toContainElement(
        `video[autoplay][playsInline][loop][muted]`
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
        expect(element).toContainElement(`video[${option}]`);
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
        expect(element).not.toContainElement(`video[${option}]`);
      });
    });
  });

  describe(`youtube`, () => {
    [
      'https://www.youtube.com/watch?v=foo-bar',
      'https://www.youtube.com/watch?v=foo-bar&foo=bar&bar=foo',
      'https://youtu.be/foo-bar',
      'https://youtu.be/foo-bar?foo=bar&bar=foo',
      'https://www.youtube.com/embed/foo-bar',
      'https://www.youtube.com/embed/foo-bar?foo=bar&bar=foo',
    ].forEach((src) => {
      describe(`when the url = '${'https://www.youtube.com/watch?v=foo-bar'}'`, () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-content-video .options=${{ src }}></oryx-content-video>`
          );
        });

        it('should create an object element with the youtube embed url', () => {
          const videoElement = element.shadowRoot?.querySelector('object');
          expect(videoElement?.getAttribute('data')).toContain(
            'https://www.youtube.com/embed/foo-bar'
          );
        });

        it('should have default parameters applied', () => {
          const videoElement = element.shadowRoot?.querySelector('object');
          expect(videoElement?.getAttribute('data')).toContain('autoplay=true');
          expect(videoElement?.getAttribute('data')).toContain('loop=true');
          expect(videoElement?.getAttribute('data')).toContain('muted=true');
        });
      });

      ['muted', 'controls', 'loop', 'autoplay'].forEach((option) => {
        describe(`when ${option} is set to true`, () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-content-video
                .options=${{ [option]: true, src }}
              ></oryx-content-video>`
            );
          });

          it(`should render video element with ${option}`, () => {
            const videoElement = element.shadowRoot?.querySelector('object');
            expect(videoElement?.getAttribute('data')).toContain(
              `${option}=true`
            );
          });
        });

        describe(`when ${option} is set to false`, () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-content-video
                .options=${{ [option]: false, src }}
              ></oryx-content-video>`
            );
          });

          it(`should render video element with ${option}`, () => {
            const videoElement = element.shadowRoot?.querySelector('object');
            expect(videoElement?.getAttribute('data')).not.toContain(
              `${option}=`
            );
          });
        });
      });
    });
  });
});
