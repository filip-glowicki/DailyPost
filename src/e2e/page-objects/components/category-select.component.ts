import { Page, Locator } from "@playwright/test";

/**
 * Component object for the CategorySelect component
 */
export class CategorySelectComponent {
  readonly page: Page;
  readonly container: Locator;
  readonly selectTrigger: Locator;
  readonly selectContent: Locator;
  readonly addCategoryButton: Locator;

  /**
   * Create a new CategorySelectComponent instance
   * @param page Playwright Page instance
   */
  constructor(page: Page) {
    this.page = page;
    this.container = page.locator('[data-test-id="category-select"]');
    this.selectTrigger = page.locator(
      '[data-test-id="category-select-trigger"]',
    );
    // Note: SelectContent is rendered in a portal at the root of the document
    this.selectContent = page.locator(
      '[data-test-id="category-select-content"]',
    );
    this.addCategoryButton = page.locator(
      '[data-test-id="add-category-button"]',
    );
  }

  /**
   * Select first category
   */
  async selectCategory() {
    // Make sure the trigger is visible and click it
    await this.selectTrigger.waitFor({ state: "visible" });
    await this.selectTrigger.click();

    // Wait for the content to be attached to the DOM
    await this.page.waitForSelector(
      '[data-test-id="category-select-content"]',
      {
        state: "attached",
      },
    );

    // Find the first option within the select content
    const option = this.selectContent
      .locator('[data-test-id^="category-option-"]')
      .first();

    await option.waitFor({ state: "visible" });

    try {
      await option.click();
    } catch {
      // If click fails, try to ensure the option is in view and retry
      await option.scrollIntoViewIfNeeded();
      await option.click();
    }
  }

  /**
   * Click the add category button to navigate to category management
   */
  async addNewCategory() {
    await this.addCategoryButton.click();
  }

  /**
   * Get all available category options
   * @returns Array of category element handles
   */
  async getCategoryOptions() {
    // Make sure the trigger is visible and click it
    await this.selectTrigger.waitFor({ state: "visible" });
    await this.selectTrigger.click();

    // Wait for the content to be attached to the DOM
    await this.page.waitForSelector(
      '[data-test-id="category-select-content"]',
      {
        state: "attached",
      },
    );

    // Get all option elements within the select content
    const options = this.selectContent.locator(
      '[data-test-id^="category-option-"]',
    );

    // Wait for at least one option to be available
    await options.first().waitFor({ state: "visible" });

    return options;
  }
}
