import { fixture } from '@open-wc/testing-helpers';
import { createInjector } from '@spryker-oryx/injector';
import { html } from 'lit';
import '../index';
import { BannerComponent } from './banner.component';

class MockService {}

describe('Banner', () => {
  let element: BannerComponent;

  createInjector({
    providers: [
      {
        provide: 'FES.Experience',
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

  // it('passes the a11y audit', async () => {
  //   await expect(element).shadowDom.to.be.accessible();
  // });
});
