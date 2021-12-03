import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { IconComponent } from './oryx-icon.component';

describe('Icon', () => {
  let element: IconComponent;

  it('is defined', () => {
    const el = document.createElement('oryx-icon');
    expect(el).to.be.instanceof(IconComponent);
  });

  describe('when no type is given', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-icon></oryx-icon>`);
    });

    it('should not render an SVG element', () => {
      const svg = element?.shadowRoot?.querySelector('svg');
      expect(svg).not.to.exist;
    });
  });

  describe('when type is "search"', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-icon type="search"></oryx-icon>`);
    });

    it('should render an SVG element', () => {
      const svg = element?.shadowRoot?.querySelector('svg');
      expect(svg).to.exist;
    });

    it('should reference an external SVG and include search ID', () => {
      const svg = element?.shadowRoot?.querySelector('svg use');
      expect(svg.getAttribute('href')).to.equal('assets/icons.svg#search');
    });
  });
});
