import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { beforeEach } from 'vitest';
import { NavigationButtonComponent } from './navigation-button.component';
import { navigationButtonComponent } from './navigation-button.def';

describe('NavigationButtonComponent', () => {
  const testPlaceholder = 'test_placeholder';
  let element: NavigationButtonComponent;

  beforeAll(async () => {
    await useComponent(navigationButtonComponent);
  });

  beforeEach(async () => {
    element = await fixture(html`
      <oryx-site-navigation-button
        text=${testPlaceholder}
      ></oryx-site-navigation-button>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render oryx-heading with proper content', () => {
    const heading = element.renderRoot.querySelector('oryx-heading');
    expect(heading?.textContent).toContain(testPlaceholder);
  });

  it('should render button', () => {
    expect(element).toContainElement('oryx-button');
  });

  describe('when content data is not provided', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-site-navigation-button></oryx-site-navigation-button>
      `);
    });

    it('should not render content parts', () => {
      expect(element).not.toContainElement('oryx-heading, mark, oryx-icon');
    });
  });

  describe('when url is provided', () => {
    const url = '/test';
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-site-navigation-button url=${url}></oryx-site-navigation-button>
      `);
    });

    it('should render anchor element with proper href', () => {
      const button = element.renderRoot.querySelector('oryx-button');
      expect(button).toHaveProperty('href', url);
    });
  });

  describe('when icon is provided', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-site-navigation-button
          icon=${testPlaceholder}
        ></oryx-site-navigation-button>
      `);
    });

    it('should render oryx-icon with proper type', () => {
      expect(element).toContainElement(`oryx-icon[type="${testPlaceholder}"]`);
    });
  });

  describe('when badge is provided', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-site-navigation-button
          badge=${testPlaceholder}
        ></oryx-site-navigation-button>
      `);
    });

    it('should render mark element with proper content', () => {
      const mark = element.renderRoot.querySelector('mark');
      expect(mark?.textContent).toContain(testPlaceholder);
    });
  });
});
