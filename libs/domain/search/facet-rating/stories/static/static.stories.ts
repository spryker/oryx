import { resolve } from '@spryker-oryx/di';
import { MockRouterService } from '@spryker-oryx/experience/mocks';
import { RouterService } from '@spryker-oryx/router';
import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Facet Rating/Static`,
};

const Template: Story = (): TemplateResult => {
  resolve<MockRouterService>(RouterService).params$.next({});

  return html`
    <h4>Default</h4>
    <oryx-search-facet-rating name="Rating" open></oryx-search-facet-rating>

    <h4>Selected value with min and max</h4>
    <oryx-search-facet-rating
      name="Selected rating"
      open
      min="1"
      max="4"
    ></oryx-search-facet-rating>

    <h4>Scaled</h4>
    <oryx-search-facet-rating
      name="Rating"
      open
      scale="7"
      max="7"
    ></oryx-search-facet-rating>

    <h4>Scaled with limited max</h4>
    <oryx-search-facet-rating
      name="Rating"
      open
      scale="7"
    ></oryx-search-facet-rating>
  `;
};

export const SelectedOption = Template.bind({});
