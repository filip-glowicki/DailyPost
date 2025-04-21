import { Page, Locator, expect } from "@playwright/test";
import { CategorySelectComponent } from "./components/category-select.component";
import { LengthSliderComponent } from "./components/length-slider.component";
import { PostDisplayComponent } from "./components/post-display.component";
import { LoadingOverlayComponent } from "./components/loading-overlay.component";

/**
 * Page Object Model for the Post Editor page
 */
export class PostEditorPage {
  // Page elements
  readonly page: Page;
  readonly editorView: Locator;
  readonly postForm: Locator;
  readonly aiGenerationSwitch: Locator;
  readonly titleInput: Locator;
  readonly promptTextarea: Locator;
  readonly contentTextarea: Locator;
  readonly submitButton: Locator;
  readonly modifyPostButton: Locator;
  readonly createNewPostButton: Locator;

  // Component objects
  readonly categorySelect: CategorySelectComponent;
  readonly lengthSlider: LengthSliderComponent;
  readonly postDisplay: PostDisplayComponent;
  readonly loadingOverlay: LoadingOverlayComponent;

  /**
   * Create a new PostEditorPage instance
   * @param page Playwright Page instance
   */
  constructor(page: Page) {
    this.page = page;

    // Initialize locators for main page elements
    this.editorView = page.locator('[data-test-id="post-editor-view"]');
    this.postForm = page.locator('[data-test-id="post-form"]');
    this.aiGenerationSwitch = page.locator(
      '[data-test-id="ai-generation-switch"]',
    );
    this.titleInput = page.locator('[data-test-id="post-title-input"]');
    this.promptTextarea = page.locator('[data-test-id="post-prompt-textarea"]');
    this.contentTextarea = page.locator(
      '[data-test-id="post-content-textarea"]',
    );
    this.submitButton = page.locator('[data-test-id="post-submit-button"]');
    this.modifyPostButton = page.locator('[data-test-id="modify-post-button"]');
    this.createNewPostButton = page.locator(
      '[data-test-id="create-new-post-button"]',
    );

    // Initialize component objects
    this.categorySelect = new CategorySelectComponent(page);
    this.lengthSlider = new LengthSliderComponent(page);
    this.postDisplay = new PostDisplayComponent(page);
    this.loadingOverlay = new LoadingOverlayComponent(page);
  }

  /**
   * Navigate to the post editor page
   */
  async goto() {
    await this.page.goto("/post/editor");
    await this.editorView.waitFor({ state: "visible" });
  }

  /**
   * Fill in the post form for AI generation
   * @param title Post title
   * @param categoryId Category ID to select
   * @param prompt Prompt for AI generation
   * @param size Post length (short, medium, long)
   */
  async fillPostForm(
    title: string,
    categoryId: string,
    prompt: string,
    size: string = "medium",
  ) {
    // Ensure AI generation is enabled
    await this.enableAiGeneration();

    // Fill out the form
    await this.titleInput.fill(title);
    await this.categorySelect.selectCategory();
    await this.promptTextarea.fill(prompt);
    await this.lengthSlider.selectLength(size);
  }

  /**
   * Fill in the post form for manual content entry
   * @param title Post title
   * @param categoryId Category ID to select
   * @param content Manual post content
   */
  async fillManualPostForm(title: string, categoryId: string, content: string) {
    // Ensure AI generation is disabled
    await this.disableAiGeneration();

    // Fill out the form
    await this.titleInput.fill(title);
    await this.categorySelect.selectCategory();
    await this.contentTextarea.fill(content);
  }

  /**
   * Enable AI generation mode
   */
  async enableAiGeneration() {
    // Get the current checked state
    const isChecked = await this.aiGenerationSwitch.isChecked();

    // Toggle if not already checked
    if (!isChecked) {
      await this.aiGenerationSwitch.click();
    }
  }

  /**
   * Disable AI generation mode
   */
  async disableAiGeneration() {
    // Get the current checked state
    const isChecked = await this.aiGenerationSwitch.isChecked();

    // Toggle if checked
    if (isChecked) {
      await this.aiGenerationSwitch.click();
    }
  }

  /**
   * Submit the form to generate or save a post
   */
  async submitForm() {
    await this.submitButton.click();
    await this.loadingOverlay.waitForOverlayToDisappear();
  }

  /**
   * Generate a post with AI
   * @param title Post title
   * @param categoryId Category ID
   * @param prompt Generation prompt
   * @param size Post length
   */
  async generatePost(
    title: string,
    categoryId: string,
    prompt: string,
    size: string = "medium",
  ) {
    await this.fillPostForm(title, categoryId, prompt, size);
    await this.submitForm();

    // Verify that the post display is visible after generation
    await expect(this.postDisplay.container).toBeVisible();
  }

  /**
   * Edit the current post
   */
  async editPost() {
    await this.postDisplay.clickEditButton();
    await expect(this.postForm).toBeVisible();
  }

  /**
   * Modify the current post
   * @param title Updated title
   * @param categoryId Updated category ID
   * @param content Updated content
   */
  async modifyPost(title?: string, categoryId?: string, content?: string) {
    if (title) {
      await this.titleInput.fill(title);
    }

    if (categoryId) {
      await this.categorySelect.selectCategory();
    }

    if (content) {
      await this.contentTextarea.fill(content);
    }

    await this.submitForm();
  }

  /**
   * Copy post content to clipboard
   */
  async copyPostToClipboard() {
    await this.postDisplay.clickCopyButton();

    // Note: Due to clipboard permission limitations in browsers,
    // actual clipboard testing might require additional permissions
    // or mock implementations in the test
  }

  /**
   * Create a new post after viewing a generated post
   */
  async createNewPost() {
    await this.createNewPostButton.click();
    await expect(this.postForm).toBeVisible();
  }
}
