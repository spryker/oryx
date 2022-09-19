import { html, LitElement, TemplateResult } from 'lit';
import { property, queryAssignedElements, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { TabComponent } from '../../tab/src';
import { TabsAppearance, TabsProperties } from './tabs.model';
import { tabsStyles } from './tabs.styles';

export class TabsComponent extends LitElement implements TabsProperties {
  static styles = tabsStyles;

  @property({ type: Number }) activeTabIndex = 0;
  @property({ type: String }) appearance = TabsAppearance.Primary;
  @property({ type: Boolean }) shadow = false;

  @queryAssignedElements({ selector: 'oryx-tab' })
  tabs!: Array<TabComponent>;

  @state() panels!: Array<HTMLElement>;
  @state() selectedTab?: TabComponent;
  @state() rangeValue?: number;

  firstUpdated(): void {
    this.selectedTab =
      this.tabs.find((tab) => tab.selected) || this.tabs[this.activeTabIndex];
    this.panels = this.getPanels(this.tabs);
    this.selectTab(this.selectedTab?.for);
    this.selectPanel(this.selectedTab?.for);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this.onClick as EventListener);
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.onClick as EventListener);
  }

  protected render(): TemplateResult {
    return html`
      <input
        type="range"
        aria-label="tabs"
        name="tabs"
        min="1"
        @change=${this.onChange}
        value="${ifDefined(this.rangeValue)}"
        .max=${(this.tabs.length ?? 0).toString()}
      />

      <slot type=${this.appearance}></slot>
    `;
  }

  protected getPanels(tabs: TabComponent[]): HTMLElement[] {
    const panels: HTMLElement[] = [];
    tabs.forEach((tab) => {
      const panel = document.querySelector(`#${tab.for}`) as HTMLElement;
      if (panel) {
        panels.push(panel);
      }
    });
    return panels;
  }

  protected selectTab(tabId?: string): void {
    const target = this.tabs.find((tab) => tab.for === tabId);
    if (target) {
      target?.scrollIntoView({ inline: 'nearest' });
    }

    if (tabId) {
      this.tabs.forEach((tab, index) => {
        tab.selected = tab.for === tabId;
        this.rangeValue =
          tab.for === tabId ? Number(index + 1) : this.rangeValue;
      });
    }
  }

  protected selectPanel(tabId?: string): void {
    if (this.panels) {
      this.panels.forEach((panel) => {
        if (panel.id === tabId) {
          panel.setAttribute('selected', '');
        } else {
          panel.removeAttribute('selected');
        }
      });
    }
  }

  protected onClick(e: Event): void {
    const targetId = (e.target as HTMLElement)
      .closest('oryx-tab')
      ?.getAttribute('for');

    const tab: TabComponent | undefined = this.tabs.find(
      (tab) => tab.for === targetId
    );

    this.tabSelect(tab);
  }

  protected onChange(e: Event): void {
    const el = e.target as HTMLInputElement;
    const tab: TabComponent | undefined = this.tabs[Number(el.value) - 1];

    this.tabSelect(tab);
  }

  private tabSelect(tab?: TabComponent): void {
    if (tab) {
      this.selectTab(tab.for);
      this.selectPanel(tab.for);
    }
  }
}
