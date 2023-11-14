import { featureVersion } from '@spryker-oryx/utilities';
import { css } from 'lit';
import { LayoutStyles } from '../../../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host {
      display: flex;
      align-items: var(--align, start);
      justify-content: var(--justify, start);
      ${featureVersion >= `1.3`
        ? css``
        : css`
            flex-wrap: wrap;
          `}
    }
  `,
};

export const verticalStyles: LayoutStyles = {
  styles: css`
    :host {
      flex-direction: column;
      align-items: var(--align, stretch);
      justify-content: var(--justify, flex-start);
    }
  `,
};
