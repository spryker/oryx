import { fixture, html } from '@open-wc/testing-helpers';
import { queryFirstAssigned } from '@spryker-oryx/typescript-utils';
import { HeadlineComponent } from './headline.component';
import './index';

describe('HeadlineComponent', () => {
  let element: HeadlineComponent;

  beforeEach(async () => {
    element = await fixture(
      html` <oryx-headline><h2 id="header">Headline</h2></oryx-headline>`
    );
  });

  it('should be initialized correctly', () => {
    expect(queryFirstAssigned<HTMLHeadingElement>(element)?.id).toBe('header');
  });
});
