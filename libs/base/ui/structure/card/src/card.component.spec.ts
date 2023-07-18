import { fixture } from '@open-wc/testing-helpers';
import { queryFirstAssigned, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { CardComponent } from './card.component';
import { cardComponent } from './card.defs';

describe('Card', () => {
  let element: CardComponent;

  beforeAll(async () => {
    await useComponent(cardComponent);
  });

  it('is defined', () => {
    const el = document.createElement('oryx-card');
    expect(el).toBeInstanceOf(CardComponent);
  });

  describe('when heading is provided by prop', () => {
    const headerProp = 'header';
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-card .heading=${headerProp}></oryx-card>`
      );
    });

    it('should render title in default place', () => {
      const cardDefaultTitle = element?.shadowRoot?.querySelector('h5');

      expect(cardDefaultTitle).not.toBeNull();
      expect(cardDefaultTitle?.textContent).toContain(headerProp);
    });
  });

  describe('when heading is provided by slot', () => {
    const titleText = 'Title provided by slot';

    beforeEach(async () => {
      element = await fixture(html`
        <oryx-card>
          <p slot="heading">${titleText}</p>
        </oryx-card>
      `);
    });

    it('should render slot content', () => {
      const el = queryFirstAssigned(element, {
        selector: 'p',
        slot: 'heading',
      }) as HTMLElement;

      expect(el.textContent).toContain(titleText);
    });
  });

  describe('when content is provided', () => {
    const textContent = 'Content text';

    beforeEach(async () => {
      element = await fixture(html`
        <oryx-card>
          <p>${textContent}</p>
        </oryx-card>
      `);
    });

    it('should render content', () => {
      const el = queryFirstAssigned(element, {
        selector: 'p',
      }) as HTMLElement;

      expect(el.textContent).toContain(textContent);
    });
  });

  describe('when footer is provided', () => {
    const footerText = 'Footer text';
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-card>
          <p slot="footer">${footerText}</p>
        </oryx-card>
      `);
    });

    it('should render footer', () => {
      const el = queryFirstAssigned(element, {
        selector: 'p',
        slot: 'footer',
      }) as HTMLElement;

      expect(el.textContent).toContain(footerText);
    });
  });
});
