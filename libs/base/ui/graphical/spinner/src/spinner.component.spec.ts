import { fixture } from '@open-wc/testing-helpers';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { a11yConfig, Size, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { spinnerComponent } from './component';
import { SpinnerComponent } from './spinner.component';

describe('Spinner', () => {
  let element: SpinnerComponent;

  beforeAll(async () => {
    await useComponent(spinnerComponent);
  });

  it('is defined', () => {
    const el = document.createElement('oryx-spinner');
    expect(el).toBeInstanceOf(SpinnerComponent);
  });

  describe('when no icon is given', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-spinner></oryx-spinner>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should render loader icon', () => {
      const loader = element?.shadowRoot?.querySelector(`oryx-icon`);
      expect(loader).not.toBeNull();
      expect(loader).toHaveProperty('type', IconTypes.Loader);
    });
  });

  describe('when custom icon is given', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-spinner icon="search"></oryx-spinner>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should render the custom icon', () => {
      const customIcon = element?.shadowRoot?.querySelector('oryx-icon');
      expect(customIcon).not.toBeNull();
      expect(customIcon).toHaveProperty('type', IconTypes.Search);
    });
  });

  describe('when no size is given', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-spinner></oryx-spinner>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should set the icon size to medium', () => {
      expect(element).toContainElement(`oryx-icon[size='${Size.Md}']`);
    });
  });

  describe('when size is set', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-spinner size=${Size.Lg}></oryx-spinner>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should set the icon size to the given one', () => {
      expect(element).toContainElement(`oryx-icon[size='${Size.Lg}']`);
    });
  });
});
