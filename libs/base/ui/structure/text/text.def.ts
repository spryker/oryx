import { componentDef, screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

const textScreenStyles = screenCss({
  lg: css`
    *[class*='lg-'] {
      font-size: var(--_fs-lg, var(--_fs));
      font-weight: var(--_fw-lg, var(--_fw));
      line-height: var(--_lh-lg, var(--_lh));
    }
  `,
  md: css`
    *[class*='md-'] {
      font-size: var(--_fs-md, var(--_fs));
      font-weight: var(--_fw-md, var(--_fw));
      line-height: var(--_lh-md, var(--_lh));
    }
  `,
  sm: css`
    *[class*='sm-'] {
      font-size: var(--_fs-sm, var(--_fs));
      font-weight: var(--_fw-sm, var(--_fw));
      line-height: var(--_lh-sm, var(--_lh));
    }
  `,
});

export const textComponent = componentDef({
  name: 'oryx-text',
  impl: () => import('./text.component').then((m) => m.TextComponent),
  stylesheets: [{ rules: [...textScreenStyles] }],
});
