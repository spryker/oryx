import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { queryFirstAssigned } from '@spryker-oryx/typescript-utils';
import { headlineComponent } from './component';
import { HeadlineComponent } from './headline.component';

describe('HeadlineComponent', () => {
  let element: HeadlineComponent;

  beforeAll(async () => {
    await useComponent(headlineComponent);
  });

  beforeEach(async () => {
    element = await fixture(
      html`<oryx-headline>
        <h2 id="header">Headline</h2>
      </oryx-headline>`
    );
  });

  it('should be initialized correctly', () => {
    expect(queryFirstAssigned<HTMLHeadingElement>(element)?.id).toBe('header');
  });
});
