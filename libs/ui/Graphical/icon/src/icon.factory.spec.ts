import { fixture, html } from '@open-wc/testing-helpers';
import { svg } from 'lit';
import { Size } from '../../../utilities';
import { IconComponent } from './icon.component';
import './index';
import { icon } from './index';

describe('factory', () => {
  let element: IconComponent;

  describe('when an icon type is given', () => {
    beforeEach(async () => {
      element = await fixture(html`${icon({ type: 'close' })}`);
    });

    it('should create an instance of icon component', () => {
      expect(element).toBeInstanceOf(IconComponent);
    });

    it('should have icon type', () => {
      expect(element.getAttribute('type')).toBe('close');
    });

    it('should use the default icon sprite', () => {
      expect(
        element.shadowRoot
          ?.querySelector('svg use')
          ?.getAttribute('href')
          ?.startsWith('assets/icons.svg')
      ).toBe(true);
    });
  });

  describe('when an icon size is given', () => {
    beforeEach(async () => {
      element = await fixture(html`${icon({ size: Size.medium })}`);
    });

    it('should have a medium size', () => {
      expect(element.getAttribute('size')).toBe('medium');
    });
  });

  describe('when an custom icon sprite is given', () => {
    beforeEach(async () => {
      element = await fixture(
        html`${icon({ type: 'close', sprite: '/foo/bar.svg' })}`
      );
    });

    it('should use the custom sprite', () => {
      expect(
        element.shadowRoot
          ?.querySelector('svg use')
          ?.getAttribute('href')
          ?.startsWith('/foo/bar.svg')
      ).toBe(true);
    });
  });

  describe('when a custom source is given', () => {
    beforeEach(async () => {
      element = await fixture(
        html`${icon({
          source: svg`<circle cx="12" cy="12" r="12" />`,
        })}`
      );
    });

    it('should render the custom SVG source', () => {
      expect(element.querySelector('svg circle')).not.toBeNull();
    });
  });
});
