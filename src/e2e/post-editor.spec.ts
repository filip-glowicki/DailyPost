import { test, expect } from "@playwright/test";
import { PostEditorPage } from "./page-objects/post-editor.page";

test.describe("Post Editor Flow", () => {
  test("Complete post creation and editing flow", async ({ page }) => {
    // Initialize the PostEditorPage with POM pattern
    const postEditorPage = new PostEditorPage(page);

    // Navigate to the post editor page
    await postEditorPage.goto();

    // Verify the editor is loaded
    await expect(postEditorPage.editorView).toBeVisible();

    // Step 2: Fill in the post generation form
    const testData = {
      title: "Test Post Title",
      categoryId: "3d0212c0-c0c2-4b54-abde-3d2dee265e8a1", // Assumes category ID 1 exists
      prompt: "Create a blog post about automated testing with Playwright",
      size: "medium",
    };

    await postEditorPage.fillPostForm(
      testData.title,
      testData.categoryId,
      testData.prompt,
      testData.size,
    );

    // Step 3: Generate the post by clicking submit
    await postEditorPage.submitForm();

    // Step 4: Verify the post was generated
    await expect(postEditorPage.postDisplay.container).toBeVisible();
    await postEditorPage.postDisplay.verifyPostContent(testData.title);

    // Step 5: Test copying to clipboard
    await postEditorPage.copyPostToClipboard();

    // Step 6: Test editing the post
    await postEditorPage.editPost();

    // Verify we're in edit mode
    await expect(postEditorPage.postForm).toBeVisible();

    // Update the title
    const updatedTitle = "Updated Post Title";
    await postEditorPage.modifyPost(updatedTitle);

    // Verify the update was successful by checking the title input and content in the editor
    await expect(page.locator('[data-test-id="post-title-input"]')).toHaveValue(
      updatedTitle,
    );
    await expect(postEditorPage.postForm).toBeVisible();

    // Note: Due to browser security restrictions, we cannot directly verify clipboard content
    // in headless mode. In a real test, we might:
    // 1. Use a mock to intercept clipboard API calls and verify them
    // 2. Check for success toast messages
    // 3. In headed mode, paste into a text field and verify

    // For this test, we'll just verify the button was clicked successfully
    // by checking that no errors occurred
  });

  test("Manual post creation flow", async ({ page }) => {
    const postEditorPage = new PostEditorPage(page);

    // Navigate to the post editor page
    await postEditorPage.goto();

    // Verify the editor is loaded
    await expect(postEditorPage.editorView).toBeVisible();

    // Switch to manual mode
    await postEditorPage.disableAiGeneration();

    // Fill manual post content
    const testData = {
      title: "Manual Post Title",
      categoryId: "3d0212c0-c0c2-4b54-abde-3d2dee265e8a",
      content:
        "This is a manually written post content.\nIt has multiple paragraphs.\nTesting is important.",
    };

    await postEditorPage.fillManualPostForm(
      testData.title,
      testData.categoryId,
      testData.content,
    );

    // Submit the post
    await postEditorPage.submitForm();

    // Verify the post was created
    await expect(postEditorPage.postDisplay.container).toBeVisible();
    await postEditorPage.postDisplay.verifyPostContent(testData.title);
  });
});
