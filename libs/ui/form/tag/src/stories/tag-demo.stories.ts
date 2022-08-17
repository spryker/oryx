import { useComponent } from '@spryker-oryx/core/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { tagComponent } from '../component';

useComponent(tagComponent);

export default {
  title: `${storybookPrefix}/Form/Tag`,
} as Meta;

interface Props {
  message: string;
  disabled: boolean;
}

const Template: Story<Props> = ({
  message,
  disabled,
}: Props): TemplateResult => {
  return html`
    <oryx-tag ?disabled=${disabled} @click=${(): void => console.log('close')}
      >${message}</oryx-tag
    >
  `;
};
export const TagDemo = Template.bind({});
TagDemo.args = {
  message: 'This is tag',
  disabled: false,
};
