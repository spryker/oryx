import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { html } from 'lit';
import VideoComponent from './video.component';
import { videoComponent } from './video.def';

describe('VideoComponent', () => {
  let element: VideoComponent;

  beforeAll(async () => {
    await useComponent(videoComponent);
  });

  describe('when a video url is provided', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-video url="test.mp4"></oryx-video>`);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render the native video element', () => {
      expect(element).toContainElement('video');
    });

    describe('and autoplay is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-video url="test.mp4" autoplay></oryx-video>`
        );
      });

      it('should render the autoplay attribute', () => {
        expect(element).toContainElement('video[autoplay]');
      });
    });

    describe('and controls is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-video url="test.mp4" controls></oryx-video>`
        );
      });

      it('should render the controls attribute', () => {
        expect(element).toContainElement('video[controls]');
      });
    });

    describe('and the loop attribute is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-video url="test.mp4" loop></oryx-video>`
        );
      });

      it('should render the loop attribute', () => {
        expect(element).toContainElement('video[loop]');
      });
    });

    describe('when muted is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-video url="test.mp4" muted></oryx-video>`
        );
      });

      it('should render the muted attribute', () => {
        expect(element).toContainElement('video[muted]');
      });
    });

    describe('and playsInline is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-video url="test.mp4" playsInline></oryx-video>`
        );
      });

      it('should render the playsInline attribute', () => {
        expect(element).toContainElement('video[playsInline]');
      });
    });

    describe('and preload is provided', () => {
      ['none', 'metadata', 'auto'].map((value) => {
        describe(`and the value is '${value}'`, () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-video url="test.mp4" .preload=${value}></oryx-video>`
            );
          });

          it('should render the playsInline attribute', () => {
            expect(element).toContainElement(`video[preload='${value}']`);
          });
        });
      });
    });
  });

  describe(`when a youtube is provided`, () => {
    [
      'https://www.youtube.com/watch?v=foo-bar',
      'https://www.youtube.com/watch?v=foo-bar&foo=bar&bar=foo',
      'https://youtu.be/foo-bar',
      'https://youtu.be/foo-bar?foo=bar&bar=foo',
      'https://www.youtube.com/embed/foo-bar',
      'https://www.youtube.com/embed/foo-bar?foo=bar&bar=foo',
    ].forEach((url) => {
      describe(`and the url equals to '${'https://www.youtube.com/watch?v=foo-bar'}'`, () => {
        beforeEach(async () => {
          element = await fixture(html`<oryx-video .url=${url}></oryx-video>`);
        });

        it('should create an object element with the youtube embed url', () => {
          const videoElement = element.shadowRoot?.querySelector('object');
          expect(videoElement?.getAttribute('data')).toContain(
            'https://www.youtube.com/embed/foo-bar'
          );
        });

        it('should have default parameters applied', () => {
          const el = element.shadowRoot?.querySelector('object');
          expect(el?.getAttribute('data')).not.toContain('controls=');
          expect(el?.getAttribute('data')).not.toContain('autoplay=');
          expect(el?.getAttribute('data')).not.toContain('loop=');
          expect(el?.getAttribute('data')).not.toContain('muted=');
        });

        describe(`and autoplay attribute is provided`, () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-video .url=${url} autoplay></oryx-video>`
            );
          });

          it('should have autoplay parameter listed in the url', () => {
            const el = element.shadowRoot?.querySelector('object');
            expect(el?.getAttribute('data')).toContain('autoplay=true');
          });
        });

        describe(`and controls attribute is provided`, () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-video .url=${url} controls></oryx-video>`
            );
          });

          it('should have controls parameter listed in the url', () => {
            const el = element.shadowRoot?.querySelector('object');
            expect(el?.getAttribute('data')).toContain('controls=true');
          });
        });

        describe(`and muted attribute is provided`, () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-video .url=${url} muted></oryx-video>`
            );
          });

          it('should have muted parameter listed in the url', () => {
            const el = element.shadowRoot?.querySelector('object');
            expect(el?.getAttribute('data')).toContain('muted=true');
          });
        });

        describe(`and loop attribute is provided`, () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-video .url=${url} loop></oryx-video>`
            );
          });

          it('should have loop parameter listed in the url', () => {
            const el = element.shadowRoot?.querySelector('object');
            expect(el?.getAttribute('data')).toContain('loop=true');
          });
        });
      });

      describe(`and autoplay, loop, controls and muted properties are provided`, () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-video
              .url=${url}
              ?autoplay=${true}
              ?controls=${true}
              ?muted=${true}
              ?loop=${true}
            ></oryx-video>`
          );
        });

        it('should have autoplay parameter listed in the url', () => {
          const el = element.shadowRoot?.querySelector('object');
          expect(el?.getAttribute('data')).toContain('autoplay=true');
          expect(el?.getAttribute('data')).toContain('controls=true');
          expect(el?.getAttribute('data')).toContain('muted=true');
          expect(el?.getAttribute('data')).toContain('loop=true');
        });
      });
    });
  });
});
