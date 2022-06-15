import { RouterService } from '@spryker-oryx/experience';
import { ExperienceCompositionPreviewComponent } from '@spryker-oryx/experience/components/experience-composition-preview.component';
import { resolve } from '@spryker-oryx/injector';

if (
  new URLSearchParams(new URL(window.location.href).search).get('ebPreview')
) {
  customElements.get('experience-composition') ||
    customElements.define(
      'experience-composition',
      ExperienceCompositionPreviewComponent
    );

  const routerService = resolve(this, RouterService);
  routerService.go(window.location.pathname);
}
