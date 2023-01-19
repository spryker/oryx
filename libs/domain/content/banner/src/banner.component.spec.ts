import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ExperienceService } from '@spryker-oryx/experience';
import { html } from 'lit';
import { BannerComponent } from './banner.component';
import { bannerComponent } from './banner.def';

class MockService {
  getContent(): Promise<any> {
    return new Promise<any>((resolve) => resolve({}));
  }
  getOptions(): Promise<any> {
    return new Promise<any>((resolve) => resolve({}));
  }
}

describe('Banner', () => {
  let element: BannerComponent;

  beforeAll(async () => {
    await useComponent(bannerComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: ExperienceService,
          useClass: MockService,
        },
      ],
    });

    element = await fixture(
      html`<oryx-banner
        .content=${{ title: 'test', content: 'test' }}
        .options=${{ alt: 'test' }}
      ></oryx-banner>`
    );
  });

  afterEach(() => {
    destroyInjector();
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(BannerComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
