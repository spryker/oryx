import { ExperienceCompositionPreviewComponent } from '@spryker-oryx/experience/components/experience-composition-preview.component';

if (
  new URLSearchParams(new URL(window.location.href).search).get('ebPreview')
) {
  customElements.get('experience-composition') ||
    customElements.define(
      'experience-composition',
      ExperienceCompositionPreviewComponent
    );
}
