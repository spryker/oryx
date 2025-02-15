import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

import { RatingProperties } from '../../index';

export default { title: `${storybookPrefix}/Graphical/Rating/Static` } as Meta;

const Template: Story<RatingProperties> = (): TemplateResult => {
  return html`
    <oryx-rating readonly value="2.5" scale="3"></oryx-rating>
    <oryx-rating readonly value="2.5"></oryx-rating>
    <oryx-rating readonly value="2.5" scale="7"></oryx-rating>
    <oryx-rating readonly value="2.5" scale="10"></oryx-rating>
  `;
};

export const RatingScales = Template.bind({});
