import { fixture } from '@open-wc/testing-helpers';
import {
  ContextService,
  DefaultEntityService,
  EntityService,
  provideEntity,
} from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { EntityTextComponent } from './entity-text.component';
import { entityText } from './entity-text.def';

describe('EntityTextComponent', () => {
  let element: EntityTextComponent;

  beforeAll(async () => {
    await useComponent(entityText);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        { provide: EntityService, useClass: DefaultEntityService },
        {
          provide: ContextService,
          useValue: {
            get: () => of({ sku: '1' }),
          },
        },
        {
          provide: 'ProductService',
          useClass: class {
            get = () =>
              of({
                name: 'Sample product',
              });
          },
        },
        provideEntity('product', {
          service: 'ProductService',
          context: 'sku',
        }),
      ],
    });
  });

  afterEach(() => {
    destroyInjector();
  });

  it('passes the a11y audit', async () => {
    element = await fixture(
      html`<oryx-product-title
        sku="1"
        .options=${{ tag: 'h1' }}
      ></oryx-product-title>`
    );

    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when the entity type is product and field is name', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-entity-text
          .options=${{ entity: 'product', field: 'name' }}
        ></oryx-entity-text>`
      );
    });

    it('should render a product name', () => {
      expect(element.shadowRoot?.innerHTML).toContain('Sample product');
    });
  });
});
