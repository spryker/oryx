import { fixture } from '@open-wc/testing-helpers';
import { ExperienceService } from '@spryker-oryx/experience';
import { createInjector } from '@spryker-oryx/injector';
import '@spryker-oryx/testing/a11y';
import { html } from 'lit';
import '../index';
import { BannerComponent } from './banner.component';

class MockService {
  getContent(): Promise<any> {
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
      html` <oryx-banner content=${{ title: 'test' }}></oryx-banner>`
    );
  });

  it('is defined', () => {
    const el = document.createElement('oryx-banner');
    expect(el).toBeInstanceOf(BannerComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
