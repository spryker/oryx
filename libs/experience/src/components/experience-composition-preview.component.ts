import { asyncValue, subscribe } from '@spryker-oryx/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { filter, merge, tap } from 'rxjs';
import { PreviewExperienceService } from '../services/experience/preview-experience.service';
import { styles } from './experience-composition-preview.style';
import { ExperienceCompositionComponent } from './experience-composition.component';

const EB_PREVIEW_FOCUS_CLASS = 'eb-preview-focus';

export class ExperienceCompositionPreviewComponent extends ExperienceCompositionComponent {
  static styles = styles;

  protected interaction$ = (
    this.experienceService as PreviewExperienceService
  )?.getInteractionData();

  protected interactionMouseEvent$ = this.interaction$.pipe(
    filter(
      (data: any) => data.action === 'mouseover' || data.action === 'mouseout'
    )
  );

  // TODO: do we need to react on composition item click?
  protected interactionClickEvent$ = this.interaction$.pipe(
    filter((data: any) => data.action === 'click'),
    tap((data: any) => {
      // TODO: scroll to target component
    })
  );

  protected interactionAddComponentEvent$ = this.interaction$.pipe(
    filter((data: any) => data.action === 'add'),
    tap((data: any) => {
      const { componentId } = data;
      // TODO: scroll to target component
    })
  );

  @subscribe()
  protected selectedComponent$ = merge(
    this.interactionMouseEvent$,
    this.interactionClickEvent$,
    this.interactionAddComponentEvent$
  ).pipe(
    tap((data: any) => {
      const focusedNameAttr = 'name';
      const root = this.shadowRoot;
      const focusedComponent = root?.querySelector(
        `.${EB_PREVIEW_FOCUS_CLASS}`
      );
      const targetComponent = root?.querySelector(
        ` [uid='${data.component.id}']`
      );

      focusedComponent?.classList.remove(EB_PREVIEW_FOCUS_CLASS);
      focusedComponent?.removeAttribute(focusedNameAttr);

      if (data.action !== 'mouseout') {
        targetComponent?.classList.add(EB_PREVIEW_FOCUS_CLASS);
        targetComponent?.setAttribute(focusedNameAttr, data.component.name);
      }
    })
  );

  override render(): TemplateResult {
    return html`
      ${asyncValue(
        this.components$,
        (components: any) =>
          html`${components.map((component: any) =>
            this.registryService.resolveTemplate(component.type, component.id)
          )}`,
        () => html`Loading...`
      )}
    `;
  }
}
