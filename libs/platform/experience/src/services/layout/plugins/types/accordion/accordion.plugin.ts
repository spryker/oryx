import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import {
  CollapsibleComponent,
  ToggleEventDetail,
} from '@spryker-oryx/ui/collapsible';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginRender,
  LayoutPluginRenderParams,
} from '../../layout.plugin';
import { renderLabelSlot } from '../util';

export class AccordionLayoutPlugin implements LayoutPlugin {
  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./accordion.schema').then((m) => m.schema),
    });
  }

  getStyles(): Observable<LayoutStyles> {
    return ssrAwaiter(import('./accordion.styles').then((m) => m.styles));
  }

  getRender(
    data: LayoutPluginRenderParams
  ): Observable<LayoutPluginRender | undefined> {
    const toggleHandler = data.options.accordionMultiExpand
      ? this.onMultiToggleAccordion
      : this.onToggleAccordion;
    if (!data.isComposition) {
      return of({
        outer: html`<div class="accordion" @toggle=${toggleHandler}>
          ${data.template}
        </div>`,
      });
    }

    return of({
      inner: html`<oryx-collapsible
        >${renderLabelSlot(data, 'heading')} ${data.template}</oryx-collapsible
      >`,
    });
  }

  protected _pauseEventHandling = false;

  protected onToggleAccordion = (
    event: CustomEvent<ToggleEventDetail>
  ): void => {
    if (this._pauseEventHandling) return;
    this._pauseEventHandling = true;
    const element = event.target as CollapsibleComponent;

    element.parentElement
      ?.querySelectorAll<CollapsibleComponent>('oryx-collapsible')
      .forEach((el) => {
        if (el !== element && el.open) el.open = false;
      });

    this._pauseEventHandling = false;
  };

  protected onMultiToggleAccordion = (
    event: CustomEvent<ToggleEventDetail>
  ): void => {
    if (!event.detail?.toggleAll || this._pauseEventHandling) return;

    this._pauseEventHandling = true;
    const element = event.target as CollapsibleComponent;

    const toggleState = !element.open;

    element.parentElement
      ?.querySelectorAll<CollapsibleComponent>('oryx-collapsible')
      .forEach((el) => {
        if (el !== element) el.open = toggleState;
      });

    this._pauseEventHandling = false;
  };
}
