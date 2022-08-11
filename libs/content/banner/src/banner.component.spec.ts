import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { ExperienceService } from '@spryker-oryx/experience';
import { createInjector } from '@spryker-oryx/injector';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { BannerComponent } from './banner.component';
import { bannerComponent } from './index';

useComponent(bannerComponent);

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

  createInjector({
    providers: [
      {
        provide: ExperienceService,
        useClass: MockService,
      },
    ],
  });

  beforeEach(async () => {
    element = await fixture(
      html`<oryx-banner
        .content=${{ title: 'test', content: 'test' }}
        .options=${{ alt: 'test' }}
      ></oryx-banner>`
    );
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(BannerComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
