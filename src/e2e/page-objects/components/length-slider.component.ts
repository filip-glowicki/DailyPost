import { Page, Locator } from "@playwright/test";

/**
 * Component object for the LengthSlider component
 */
export class LengthSliderComponent {
  readonly page: Page;
  readonly container: Locator;
  readonly slider: Locator;
  readonly shortOption: Locator;
  readonly mediumOption: Locator;
  readonly longOption: Locator;

  /**
   * Create a new LengthSliderComponent instance
   * @param page Playwright Page instance
   */
  constructor(page: Page) {
    this.page = page;
    this.container = page.locator('[data-test-id="post-length-slider"]');
    this.slider = page.locator('[data-test-id="post-length-slider-input"]');
    this.shortOption = page.locator('[data-test-id="length-option-short"]');
    this.mediumOption = page.locator('[data-test-id="length-option-medium"]');
    this.longOption = page.locator('[data-test-id="length-option-long"]');
  }

  /**
   * Select a length for the post
   * @param length The length to select: 'short', 'medium', or 'long'
   */
  async selectLength(length: string) {
    // Map length to option locator
    let optionLocator: Locator;

    switch (length.toLowerCase()) {
      case "short":
        optionLocator = this.shortOption;
        break;
      case "medium":
        optionLocator = this.mediumOption;
        break;
      case "long":
        optionLocator = this.longOption;
        break;
      default:
        throw new Error(
          `Invalid length: ${length}. Must be 'short', 'medium', or 'long'.`,
        );
    }

    // Click the option to set the slider
    await optionLocator.click();
  }

  /**
   * Get the current selected length
   * @returns The currently selected length as 'short', 'medium', or 'long'
   */
  async getCurrentLength(): Promise<string> {
    // We can determine the selected length by checking which option has a different style/attribute
    // This is a bit implementation-dependent, but we can check for focus/selected styles

    // For now, let's assume we can determine by checking slider value
    // This is a simplified example and might need adjustment based on exact implementation
    const sliderValue = await this.slider.evaluate((el) => {
      return (el as HTMLInputElement).value;
    });

    // Map slider values to length
    const lengthMap: Record<string, string> = {
      "0": "short",
      "1": "medium",
      "2": "long",
    };

    return lengthMap[sliderValue] || "medium";
  }
}
