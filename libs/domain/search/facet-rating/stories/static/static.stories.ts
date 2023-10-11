import { waitForShadowDom } from '@/tools/storybook';
import { resolve } from '@spryker-oryx/di';
import { MockRouterService } from '@spryker-oryx/experience/mocks';
import { RouterService } from '@spryker-oryx/router';
import { SearchRatingFacetComponent } from '@spryker-oryx/search/facet-rating';
import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Facet Rating/Static`,
};

const Template: Story = (): TemplateResult => {
  resolve<MockRouterService>(RouterService).params$.next({});

  return html`<oryx-search-facet-rating
    name="Rating"
    open
    .options=${{ max: 5 }}
  ></oryx-search-facet-rating> `;
};

export const SelectedOption = Template.bind({});

SelectedOption.play = async (obj: {
  canvasElement: HTMLElement;
}): Promise<void> => {
  const component = <SearchRatingFacetComponent>(
    obj.canvasElement.querySelector('oryx-search-facet-rating')
  );
  await waitForShadowDom(component);
  component.renderRoot.querySelector<HTMLInputElement>(
    'input[value="4"]'
  )!.checked = true;
};
