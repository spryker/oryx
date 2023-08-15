import {
  ExperienceAdapter,
  ExperienceQualifier,
} from '@spryker-oryx/experience';
import { Observable } from 'rxjs';
import { Content, ContentQualifier } from '../models';

export type ContentAdapter = Partial<ExperienceAdapter> & {
  getAll(qualifier: ContentQualifier): Observable<Content[] | null>;
  get(qualifier: ExperienceQualifier): Observable<Content | null>;
};

export const ContentAdapter = 'oryx.ContentAdapter*';

declare global {
  interface InjectionTokensContractMap {
    [ContentAdapter]: ContentAdapter;
  }
}
