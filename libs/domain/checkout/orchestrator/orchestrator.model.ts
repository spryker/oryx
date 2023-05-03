export interface CheckoutOrchestratorComponentOptions {
  /**
   * When an auth page is provided, the checkout orchestration will redirect to this page
   * when the user is not authenticated and guest checkout is not supported
   */
  checkoutAuthPage?: string;
}
