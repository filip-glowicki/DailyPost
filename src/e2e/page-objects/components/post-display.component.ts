import { Page, Locator, expect } from "@playwright/test";

/**
 * Component object for the PostDisplay component
 */
export class PostDisplayComponent {
  readonly page: Page;
  readonly container: Locator;
  readonly title: Locator;
  readonly content: Locator;
  readonly promptDisplay: Locator;
  readonly editButton: Locator;
  readonly copyButton: Locator;

  /**
   * Create a new PostDisplayComponent instance
   * @param page Playwright Page instance
   */
  constructor(page: Page) {
    this.page = page;
    this.container = page.locator('[data-test-id="post-display"]');
    this.title = this.container.locator(".text-2xl").first();
    this.content = page.locator('[data-test-id="post-content"]');
    this.promptDisplay = page.locator('[data-test-id="post-prompt-display"]');
    this.editButton = page.locator('[data-test-id="edit-post-button"]');
    this.copyButton = page.locator('[data-test-id="copy-content-button"]');
  }

  /**
   * Get the post title text
   * @returns The post title as text
   */
  async getTitle(): Promise<string> {
    return await this.title.innerText();
  }

  /**
   * Get the post content text
   * @returns The post content as text
   */
  async getContent(): Promise<string> {
    // This will concatenate all paragraph texts into a single string
    return await this.content.innerText();
  }

  /**
   * Get the prompt text that was used to generate the post
   * @returns The prompt text or null if not found
   */
  async getPrompt(): Promise<string | null> {
    // Check if prompt is present
    const isVisible = await this.promptDisplay.isVisible();
    if (!isVisible) {
      return null;
    }

    return await this.promptDisplay.innerText();
  }

  /**
   * Click the edit button to modify the post
   */
  async clickEditButton() {
    await this.editButton.click();
  }

  /**
   * Click the copy button to copy content to clipboard
   */
  async clickCopyButton() {
    await this.copyButton.click();

    // Optionally verify that toast notification appears
    // This depends on the implementation of toast notifications
    // Example:
    // await expect(this.page.locator('text=Content copied to clipboard')).toBeVisible();
  }

  /**
   * Verify that the post display has expected content
   * @param expectedTitle Expected title
   */
  async verifyPostContent(expectedTitle: string) {
    // Verify title
    await expect(this.title).toHaveText(expectedTitle);
  }
}
