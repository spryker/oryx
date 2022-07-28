import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../../.constants';
import '../../index';
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
