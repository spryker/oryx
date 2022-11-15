import { html, LitElement, TemplateResult } from 'lit';
import { property, queryAssignedElements, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { TabComponent } from '../../tab/src';
import { TabsAppearance, TabsProperties } from './tabs.model';
import { baseStyles } from './tabs.styles';

export class TabsComponent extends LitElement implements TabsProperties {
  static styles = baseStyles;

  @property({ type: Number }) activeTabIndex = 0;
  @property({ type: String, reflect: true }) appearance =
    TabsAppearance.Primary;
  @property({ type: Boolean, reflect: true }) shadow = false;

  @queryAssignedElements({ selector: 'oryx-tab' })
  tabs!: Array<TabComponent>;
  @queryAssignedElements({ slot: 'panels' })
  protected panels?: Array<HTMLElement>;

  @state() rangeValue?: number;

  protected render(): TemplateResult {
    return html`
      <input
        type="range"
        aria-label="tabs"
        min="1"
        @change=${this.onChange}
        value="${ifDefined(this.rangeValue)}"
        .max=${(this.tabs.length ?? 0).toString()}
      />
      <slot @click=${this.onClick} @slotchange=${this.onSlotChange}></slot>
      <slot name="panels"></slot>
    `;
  }

  protected select(tab?: TabComponent | null): void {
    if (!tab) {
      return;
    }

    this.tabs?.forEach((t, index) => {
      t.selected = t === tab;
      if (t.selected) {
        this.rangeValue = index + 1;
      }
    });
    if (tab.hasAttribute('for')) {
      this.panels?.forEach((panel) =>
        panel.toggleAttribute('selected', panel.id === tab.getAttribute('for'))
      );
    } else {
      const tabIndex = this.tabs?.indexOf(tab);
      this.panels?.forEach((panel, index) =>
        panel.toggleAttribute('selected', tabIndex === index)
      );
    }

    tab.scrollIntoView({ block: 'nearest' });
  }

  protected onSlotChange(): void {
    const tab =
      this.tabs?.find((tab) => tab.selected) ||
      this.tabs?.[this.activeTabIndex];
    this.select(tab);
  }

  protected onClick(e: Event): void {
    const tab = (e.target as HTMLElement).closest<TabComponent>('oryx-tab');
    this.select(tab);
  }

  protected onChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const tab: TabComponent | undefined = this.tabs?.[Number(target.value) - 1];
    this.select(tab);
  }
}
