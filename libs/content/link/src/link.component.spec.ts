import { fixture } from '@open-wc/testing-helpers';
import { ExperienceService } from '@spryker-oryx/experience';
import { createInjector } from '@spryker-oryx/injector';
import '@spryker-oryx/testing';
import { html } from 'lit';
import '../index';
import { ContentLinkComponent } from './link.component';

class MockService {
  getContent(): Promise<any> {
    return new Promise<any>((resolve) => resolve({}));
  }
  getOptions(): Promise<any> {
    return new Promise<any>((resolve) => resolve({}));
  }
}

describe('Link', () => {
  let element: ContentLinkComponent;

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
      html` <content-link
        .content=${{ text: 'test', href: '/test' }}
        .options=${{ target: '_blank' }}
      ></content-link>`
    );
  });

  it('is defined', () => {
    const el = document.createElement('content-link');
    expect(el).toBeInstanceOf(ContentLinkComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
