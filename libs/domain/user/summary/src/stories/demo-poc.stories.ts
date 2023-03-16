import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Summary`,
};

@customElement('events-orchestrator')
class eventsOrchestrator extends LitElement {
  protected onEvent(): void {
    this.renderRoot.querySelector('oryx-modal')?.toggleAttribute('open', true);
  }

  render(): TemplateResult {
    return html`
      <oryx-modal> modal content </oryx-modal>
      <slot @modal.event=${this.onEvent}></slot>
    `;
  }
}

const Template = (): TemplateResult => {
  return html`
    <style>
      section {
        display: flex;
        gap: 20px;
      }
    </style>
    <section>
      <div>
        <h4>Default</h4>
        <oryx-user-summary></oryx-user-summary>
      </div>
      <div>
        <h4>Icon</h4>
        <oryx-user-summary .options=${{ type: 'icon' }}></oryx-user-summary>
      </div>
      <div>
        <h4>Url</h4>
        <oryx-user-summary
          .options=${{ type: 'icon', url: 'www.google.com' }}
          type="icon"
        ></oryx-user-summary>
      </div>
      <div>
        <h4>Custom icon</h4>
        <oryx-user-summary
          .options=${{ type: 'icon', icon: 'add' }}
          type="icon"
        ></oryx-user-summary>
      </div>
      <div>
        <h4>Event</h4>
        <events-orchestrator>
          <oryx-user-summary
            .options=${{ type: 'icon', eventName: 'modal.event' }}
          ></oryx-user-summary>
        </events-orchestrator>
      </div>
    </section>
  `;
};

export const DemoPOC = Template.bind({});
