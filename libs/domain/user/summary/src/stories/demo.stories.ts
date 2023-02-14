import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Summary`,
};

const Template = (): TemplateResult => {
  return html`<oryx-user-summary></oryx-user-summary>`;
};

export const Demo = Template.bind({});
