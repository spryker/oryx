import { Observable } from 'rxjs';
import { OauthGrantType, OauthProviderRequest } from './config.model';
import { OauthResponseSuccess } from './response.model';

export interface OauthProvider {
  authenticate(request?: OauthProviderRequest): Observable<void>;
  getToken(): Observable<OauthResponseSuccess>;
  handleCallback?(url: URL): Observable<void>;
  refreshToken?(): Observable<void>;
  revoke?(): Observable<void>;
}

export type InferOauthProvider<T> = T extends OauthGrantType
  ? OauthProvidersMap[T]['provider']
  : OauthProvider;
