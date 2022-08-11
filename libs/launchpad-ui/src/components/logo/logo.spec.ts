import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { getShadowElementBySelector } from '@spryker-oryx/testing';
import { html, LitElement } from 'lit';
import { logo } from './index';
import { iconAsset } from './logo';

useComponent(logo);

describe('Logo', () => {
  let element: LitElement;

  beforeEach(async () => {
    element = await fixture(html`<oryx-lp-logo></oryx-lp-logo>`);
  });

  it('should render the logo', () => {
    expect(element).toContainElement('[data-testid="logo"]');
  });

  it('should render the icon part properly', () => {
    const icon = getShadowElementBySelector(
      element,
      '[data-testid="logo-icon"]'
    );

    expect(icon?.getAttribute('href')).toEqual(`${iconAsset}#logo`);
  });

  it('should render the text part properly', () => {
    const icon = getShadowElementBySelector(
      element,
      '[data-testid="logo-text"]'
    );

    expect(icon?.getAttribute('href')).toEqual(`${iconAsset}#text`);
  });
});
