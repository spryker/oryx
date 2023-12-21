import { ProductComponentProperties } from '@spryker-oryx/product';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Offer List`,
  args: { sku: 'mp-1' },
  argTypes: {},
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

type Props = { offerId?: string } & ProductComponentProperties;

const Template: Story<Props> = (props: Props): TemplateResult => {
  const { sku } = props;
  return html`
    <oryx-merchant-offer-list .sku=${sku}></oryx-merchant-offer-list>
  `;
};

export const OfferListDemo = Template.bind({});
