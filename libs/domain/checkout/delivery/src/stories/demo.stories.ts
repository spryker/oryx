import { BehaviorType, toggleBehavior } from '@spryker-oryx/checkout/mocks';
import { ComponentMixin, ContentController } from '@spryker-oryx/experience';
import { subscribe } from '@spryker-oryx/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { tap } from 'rxjs';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Delivery`,
  argTypes: {
    behavior: {
      options: ['guest', 'no-address', 'with-address'] as BehaviorType[],
      control: { type: 'select' },
      table: { category: 'Filtering' },
    },
  },
} as unknown as Meta;

interface Props {
  behavior: BehaviorType;
}

@customElement('fake-orchestrator')
class FakeOrchestrator extends ComponentMixin<Props>() {
  @subscribe()
  protected options$ = new ContentController(this)
    .getOptions()
    .pipe(tap(({ behavior }) => toggleBehavior(behavior)));

  render(): TemplateResult {
    return html``;
  }
}

const Template: Story<Props> = (props): TemplateResult => {
  return html`
    <fake-orchestrator .options=${props}></fake-orchestrator>
    <oryx-checkout-delivery></oryx-checkout-delivery>
  `;
};

export const Demo = Template.bind({});

Demo.args = {
  behavior: 'guest',
};
