import {Component, PreviewExperienceService} from '@spryker-oryx/experience';
import {signal, subscribe} from '@spryker-oryx/utilities';
import {catchError, filter, map, merge, of, switchMap, tap} from 'rxjs';
import {previewStyles} from './experience-composition-preview.styles';
import {ExperienceCompositionComponent} from './experience-composition.component';

const EB_PREVIEW_FOCUS_CLASS = 'eb-preview-focus';

export class ExperienceCompositionPreviewComponent extends ExperienceCompositionComponent {
  static override styles = [previewStyles];

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
    filter((data: any) => data.action === 'add')
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

  protected routeDriven = false;

  @subscribe()
  protected $uidFromRoute2 = this.route$.pipe(
    filter((route) => !!route),
    tap(( route) => {
      const headerEdit$ = (this.experienceService as PreviewExperienceService)
        .headerEdit$;
      if (route) {
        if (route === '/_header' || route === '/_footer') {
          if (!headerEdit$.value) {
            this.routeDriven = true;
            headerEdit$.next(true);
          }
        } else if (headerEdit$.value) {
          this.routeDriven = false;
          headerEdit$.next(false);
        }
      }
    }),
  );

  protected components$ = this.uid$.pipe(
    switchMap((uid) => {
        const headerEdit$ = (this.experienceService as PreviewExperienceService)
          .headerEdit$;

        const component = this.experienceService
            .getComponent({uid})
            .pipe(catchError(() => of({} as Component)));

        if (!this.routeDriven && (uid === 'header' || uid === 'footer')) {
          return component.pipe(
            switchMap((component) =>
              headerEdit$.pipe(
                map((edit) => (edit ? ({} as Component) : component))
              )
            )
          );
        }
        return component;
      }
    ),
    map((component: Component) => component?.components ?? [])
  );


  protected override    $components = signal(this.components$);
}
