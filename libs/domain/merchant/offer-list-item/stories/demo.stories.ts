import { ProductComponentProperties } from '@spryker-oryx/product';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Offer List Item`,
  args: { sku: 'mp-1', offerId: 'offer-1' },
  argTypes: {},
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

type Props = { offerId?: string } & ProductComponentProperties;

const Template: Story<Props> = (props: Props): TemplateResult => {
  const { sku, offerId } = props;
  return html`test
    <oryx-merchant-offer-list-item
      .sku=${sku}
      .offerId=${offerId}
    ></oryx-merchant-offer-list-item> `;
};

export const OfferListDemo = Template.bind({});
