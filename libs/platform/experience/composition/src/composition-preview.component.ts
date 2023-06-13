import { PreviewExperienceService } from '@spryker-oryx/experience';
import { subscribe } from '@spryker-oryx/utilities';
import { filter, merge, tap } from 'rxjs';
import { previewStyles } from './composition-preview.styles';
import { CompositionComponent } from './composition.component';

const EB_PREVIEW_FOCUS_CLASS = 'eb-preview-focus';

export class CompositionPreviewComponent extends CompositionComponent {
  static styles = [previewStyles];

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
  // protected override components$ = combineLatest([this.uid$, this.route$]).pipe(
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   tap(([uid, route]) => {
  //     const headerEdit$ = (this.experienceService as PreviewExperienceService)
  //       .headerEdit$;

  //     if (route) {
  //       if (route === '/_header' || route === '/_footer') {
  //         if (!headerEdit$.value) {
  //           headerEdit$.next(true);
  //         }
  //       } else if (headerEdit$.value) {
  //         headerEdit$.next(false);
  //       }
  //     }
  //   }),
  //   switchMap(([uid, route]) => {
  //     const headerEdit$ = (this.experienceService as PreviewExperienceService)
  //       .headerEdit$;

  //     const component =
  //       this.experienceService?.getComponent({ uid, route }) ||
  //       of({} as Component);
  //     if (uid === 'header' || uid === 'footer') {
  //       return component.pipe(
  //         switchMap((component) =>
  //           headerEdit$.pipe(
  //             map((edit) => (edit ? ({} as Component) : component))
  //           )
  //         )
  //       );
  //     }
  //     return component;
  //   }),
  //   tap((component) => {
  //     this.uid = component?.id;
  //   }),
  //   map((component: Component) => component?.components ?? [])
  // );
}
