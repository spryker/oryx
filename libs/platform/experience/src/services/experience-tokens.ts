import { TemplateResult } from 'lit';

export const ComponentMapping = 'FES.ComponentMapping*';
export const ContentBackendUrl = 'FES.ContentBackendUrl';

declare global {
  interface Environment {
    readonly FES_CONTENT_BACKEND_URL?: string;
  }
}

export interface ComponentMapping {
  [key: string]: {
    tag?: string;
    component?: () => void;
    template?: (uid: string, layoutClasses?: string) => TemplateResult;
  };
}

declare global {
  interface InjectionTokensContractMap {
    [ComponentMapping]: ComponentMapping[];
  }
}
