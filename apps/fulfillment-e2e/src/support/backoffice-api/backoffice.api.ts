export class BackofficeApi {
  baseUrl = Cypress.env('backofficeApiUrl');

  private _accessToken: string;

  public get accessToken(): string {
    return this._accessToken;
  }

  public set accessToken(value: string) {
    this._accessToken = value;
  }

  getHeaders() {
    let headers = {
      'Content-Type': 'application/vnd.api+json',
    };

    if (this.accessToken) {
      headers = Object.assign(headers, {
        Authorization: `${this.accessToken}`,
      });
    }

    return headers;
  }
}
