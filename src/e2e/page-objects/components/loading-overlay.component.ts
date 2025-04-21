import { Page, Locator, expect } from "@playwright/test";

/**
 * Component object for the LoadingOverlay component
 */
export class LoadingOverlayComponent {
  readonly page: Page;
  readonly overlay: Locator;
  readonly message: Locator;

  /**
   * Create a new LoadingOverlayComponent instance
   * @param page Playwright Page instance
   */
  constructor(page: Page) {
    this.page = page;
    this.overlay = page.locator('[data-test-id="loading-overlay"]');
    this.message = page.locator('[data-test-id="loading-message"]');
  }

  /**
   * Check if the loading overlay is visible
   * @returns True if the overlay is visible, false otherwise
   */
  async isVisible(): Promise<boolean> {
    return await this.overlay.isVisible();
  }

  /**
   * Get the current loading message text
   * @returns The current loading message text
   */
  async getMessage(): Promise<string> {
    return await this.message.innerText();
  }

  /**
   * Wait for the loading overlay to appear
   * @param timeout Maximum time to wait in milliseconds (default: 5000)
   */
  async waitForOverlayToAppear(timeout = 5000) {
    await this.overlay.waitFor({
      state: "visible",
      timeout,
    });
  }

  /**
   * Wait for the loading overlay to disappear
   * @param timeout Maximum time to wait in milliseconds (default: 30000)
   */
  async waitForOverlayToDisappear(timeout = 30000) {
    await this.overlay.waitFor({
      state: "hidden",
      timeout,
    });
  }

  /**
   * Verify that the loading overlay appears and then disappears
   * @param timeout Maximum time to wait in milliseconds (default: 30000)
   */
  async verifyLoadingCycle(timeout = 30000) {
    // First verify that the loading overlay appears
    await this.waitForOverlayToAppear();

    // Now wait for it to disappear
    await this.waitForOverlayToDisappear(timeout);
  }
}
