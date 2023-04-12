import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { html } from 'lit';
import { beforeEach } from 'vitest';
import { NavigationButtonComponent } from './navigation-button.component';
import { navigationButtonComponent } from './navigation-button.def';

describe('NavigationButtonComponent', () => {
  let element: NavigationButtonComponent;

  beforeAll(async () => {
    await useComponent(navigationButtonComponent);
  });

  beforeEach(async () => {
    element = await fixture(html`
      <oryx-site-navigation-button text="test"></oryx-site-navigation-button>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render oryx-heading', () => {
    expect(element).toContainElement('oryx-heading');
  });

  it('should render button', () => {
    expect(element).toContainElement('button');
  });

  describe('when text is not provided', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-site-navigation-button></oryx-site-navigation-button>
      `);
    });

    it('should not render oryx-heading', () => {
      expect(element).not.toContainElement('oryx-heading');
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
      expect(element).toContainElement(`a[href="${url}"]`);
    });
  });

  describe('when icon is provided', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-site-navigation-button icon="test"></oryx-site-navigation-button>
      `);
    });

    it('should render oryx-icon', () => {
      expect(element).toContainElement('oryx-icon');
    });
  });

  describe('when badge is provided', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-site-navigation-button badge="test"></oryx-site-navigation-button>
      `);
    });

    it('should render mark element', () => {
      expect(element).toContainElement('mark');
    });
  });
});
