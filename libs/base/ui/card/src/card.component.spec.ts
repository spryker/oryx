import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { queryFirstAssigned } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { CardComponent } from './card.component';
import { cardComponent } from './component';

describe('Card', () => {
  let element: CardComponent;

  beforeAll(async () => {
    await useComponent(cardComponent);
  });

  it('is defined', () => {
    const el = document.createElement('oryx-card');
    expect(el).toBeInstanceOf(CardComponent);
  });

  describe('when header is provided by prop', () => {
    const headerProp = 'header';
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-card .header=${headerProp}></oryx-card>`
      );
    });

    it('should render title in default place', () => {
      const cardDefaultTitle = element?.shadowRoot?.querySelector('h5');

      expect(cardDefaultTitle).not.toBeNull();
      expect(cardDefaultTitle?.textContent).toContain(headerProp);
    });
  });

  describe('when header is provided by slot', () => {
    const titleText = 'Title provided by slot';

    beforeEach(async () => {
      element = await fixture(html`
        <oryx-card>
          <p slot="header">${titleText}</p>
        </oryx-card>
      `);
    });

    it('should render slot content', () => {
      const el = queryFirstAssigned(element, {
        selector: 'p',
        slot: 'header',
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
