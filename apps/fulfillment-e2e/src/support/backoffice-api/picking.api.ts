import { BackofficeApi } from './backoffice.api';

export class PickingApi extends BackofficeApi {
  startPicking = (pickingId: string) => {
    return cy.request({
      method: 'POST',
      url: `${this.baseUrl}/picking-lists/${pickingId}/start-picking`,
      headers: this.getHeaders(),
      body: {},
    });
  };
}
