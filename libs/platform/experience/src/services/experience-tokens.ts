import { TemplateResult } from 'lit';

export const ComponentMapping = 'oryx.ComponentMapping*';
export const ContentBackendUrl = 'oryx.ContentBackendUrl';

declare global {
  interface Environment {
    readonly FES_CONTENT_BACKEND_URL?: string;
  }
}

export interface ComponentMapping {
  [key: string]: {
    tag?: string;
    component?: () => void;
    template?: (uid: string, markers?: string) => TemplateResult;
  };
}

declare global {
  interface InjectionTokensContractMap {
    [ComponentMapping]: ComponentMapping[];
  }
}
