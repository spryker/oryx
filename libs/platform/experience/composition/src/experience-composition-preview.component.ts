import { resolve } from '@spryker-oryx/di';
import {
  Component,
  ExperienceDataClientService,
  PreviewExperienceService,
} from '@spryker-oryx/experience';
import { asyncValue, subscribe } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import {
  combineLatest,
  EMPTY,
  filter,
  map,
  merge,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { compositionStyles } from './composition.styles';
import { previewStyles } from './experience-composition-preview.style';
import { ExperienceCompositionComponent } from './experience-composition.component';

const EB_PREVIEW_FOCUS_CLASS = 'eb-preview-focus';

export class ExperienceCompositionPreviewComponent extends ExperienceCompositionComponent {
  static override styles = [compositionStyles, previewStyles];

  protected dataClient = resolve(ExperienceDataClientService, null);

  @subscribe()
  protected initializeEvent$ = this.dataClient?.initialize() ?? EMPTY;

  protected interaction$ = (
    this.experienceService as PreviewExperienceService
  )?.getInteractionData();

  protected interactionMouseEvent$ = this.interaction$.pipe(
    filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data: any) => data.action === 'mouseover' || data.action === 'mouseout'
    )
  );

  // TODO: do we need to react on composition item click?
  protected interactionClickEvent$ = this.interaction$.pipe(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter((data: any) => data.action === 'click')
  );

  protected interactionAddComponentEvent$ = this.interaction$.pipe(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter((data: any) => data.action === 'add'),
  );

  @subscribe()
  protected selectedComponent$ = merge(
    this.interactionMouseEvent$,
    this.interactionClickEvent$,
    this.interactionAddComponentEvent$
  ).pipe(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tap((data: any) => {
      const focusedNameAttr = 'name';
      const root = this.shadowRoot;
      const focusedComponent = root?.querySelector(
        `.${EB_PREVIEW_FOCUS_CLASS}`
      );
      const targetComponent = root?.querySelector(
        ` [uid='${data.component.id}']`
      );

      if (
        targetComponent &&
        getComputedStyle(targetComponent).display === 'inline'
      ) {
        (targetComponent as HTMLElement)?.style.setProperty('display', 'block');
      }

      focusedComponent?.classList.remove(EB_PREVIEW_FOCUS_CLASS);
      focusedComponent?.removeAttribute(focusedNameAttr);
      (focusedComponent as HTMLElement)?.style.removeProperty('display');

      if (data.action !== 'mouseout') {
        targetComponent?.classList.add(EB_PREVIEW_FOCUS_CLASS);
        targetComponent?.setAttribute(focusedNameAttr, data.component.name);
      }
    })
  );

  // TODO: temporary solution, hiding header and footer for header or footer editing
  // The whole override may be dropped when we will have proper template extensibility mechanism
  protected override components$: Observable<Component[]> = combineLatest([
    this.uid$,
    this.route$,
  ]).pipe(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tap(([uid, route]) => {
      const headerEdit$ = (this.experienceService as PreviewExperienceService)
        .headerEdit$;

      if (route) {
        if (route === '/_header' || route === '/_footer') {
          if (!headerEdit$.value) {
            headerEdit$.next(true);
          }
        } else if (headerEdit$.value) {
          headerEdit$.next(false);
        }
      }
    }),
    switchMap(([uid, route]) => {
      const headerEdit$ = (this.experienceService as PreviewExperienceService)
        .headerEdit$;

      const component =
        this.experienceService?.getComponent({ uid, route }) ||
        of({} as Component);
      if (uid === 'header' || uid === 'footer') {
        return component.pipe(
          switchMap((component) =>
            headerEdit$.pipe(
              map((edit) => (edit ? ({} as Component) : component))
            )
          )
        );
      }
      return component;
    }),
    map((component: Component) => component?.components ?? [])
  );

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(
        this.components$,
        (components) =>
          html`<oryx-layout .uid=${this.uid}>
            ${components
              ? repeat(
                  components,
                  (component) => component.id,
                  (component) =>
                    this.registryService.resolveTemplate(
                      component.type,
                      component.id,
                      this.getLayoutClasses(component)
                    )
                )
              : ``}
            ${this.addInlineStyles(components)}
          </oryx-layout>`,
        () => html`Loading...`
      )}
    `;
  }
}
