export class GlueApi {
  baseUrl = Cypress.env('glueApiUrl');

  private _customerUniqueId: number = Math.random();

  public get customerUniqueId(): number {
    return this._customerUniqueId;
  }

  public set customerUniqueId(value: number) {
    this._customerUniqueId = value;
  }

  private _accessToken: string;

  public get accessToken(): string {
    return this._accessToken;
  }

  public set accessToken(value: string) {
    this._accessToken = value;
    // if accessToken is set -> user can't be anonymous anymore
    this.isAnonymousUser = false;
  }

  isAnonymousUser = true;

  getHeaders() {
    let headers = {};

    if (this.isAnonymousUser) {
      headers = Object.assign(headers, {
        'X-Anonymous-Customer-Unique-Id': this.customerUniqueId,
      });
    }

    if (this.accessToken) {
      headers = Object.assign(headers, {
        Authorization: `Bearer ${this.accessToken}`,
      });
    }

    return headers;
  }
}
