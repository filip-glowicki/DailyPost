import { test as setup } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  // Navigate to sign in page
  await page.goto("/sign-in");

  // Get credentials from environment variables
  const username = process.env.E2E_USERNAME;
  const password = process.env.E2E_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "Environment variables E2E_USERNAME and E2E_PASSWORD must be set",
    );
  }

  // Fill in login form
  await page.locator('[data-test-id="login-email-input"]').fill(username);
  await page.locator('[data-test-id="login-password-input"]').fill(password);
  await page.locator('[data-test-id="login-submit-button"]').click();

  // Wait for successful login and redirection
  await page.waitForURL("**/post/editor");

  // Store the authentication state
  await page.context().storageState({ path: authFile });
});
