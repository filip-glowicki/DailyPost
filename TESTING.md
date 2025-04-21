# Testing Guide for DailyPost

This project uses two testing frameworks:

- **Vitest** for unit and component testing
- **Playwright** for end-to-end (E2E) testing

## Project Test Structure

```
src/
├── tests/           # Unit tests
│   ├── setup-tests.ts  # Vitest setup file
│   └── *.test.ts    # Unit test files
├── e2e/             # E2E tests
│   ├── page-objects/ # Page object models for E2E tests
│   └── *.spec.ts     # E2E test files
└── utils/           # Utility functions tested by unit tests
```

## Unit Testing with Vitest

Unit tests are located in the `src/tests` directory with a `.test.ts` or `.test.tsx` extension.

### Running Unit Tests

```bash
# Run all unit tests
pnpm test:unit

# Run unit tests in watch mode (automatically rerun on file changes)
pnpm test:unit:watch

# Run unit tests with UI for debugging and visualization
pnpm test:unit:ui

# Run unit tests with coverage report
pnpm test:unit:coverage
```

### Writing Unit Tests

- Place test files in the `src/tests` directory with `.test.ts` or `.test.tsx` extension
- Follow the Arrange-Act-Assert pattern
- Use descriptive test names that explain the expected behavior
- Group related tests with `describe` blocks
- Prefer smaller, focused tests over large tests with multiple assertions

Example:

```typescript
import { describe, it, expect } from "vitest";
import { myFunction } from "../utils/my-file";

describe("myFunction", () => {
  it("should handle normal input correctly", () => {
    // Arrange
    const input = "test";

    // Act
    const result = myFunction(input);

    // Assert
    expect(result).toBe("expected output");
  });
});
```

## E2E Testing with Playwright

E2E tests are located in the `src/e2e` directory.

### Running E2E Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run E2E tests with UI for debugging and visualization
pnpm test:e2e:ui

# Run E2E tests in debug mode
pnpm test:e2e:debug

# Run a specific test file with a headed browser
npx playwright test src/e2e/example.spec.ts --headed
```

### Writing E2E Tests

We use the Page Object Model pattern for organizing E2E tests:

1. Place page objects in `src/e2e/page-objects/` directory
2. Create test files in the `src/e2e/` directory with `.spec.ts` extension
3. Use locators to find elements rather than selectors when possible
4. Use assertions to verify expected behavior

Example:

```typescript
import { test, expect } from "@playwright/test";
import { HomePage } from "./page-objects/home-page";

test("should load homepage correctly", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.verifyPageLoaded();
});
```

## Initial Setup

If you're setting up the tests for the first time, follow these steps:

1. Install the required dependencies:

   ```bash
   pnpm install
   ```

2. Install the Chromium browser for Playwright:
   ```bash
   npx playwright install chromium
   ```

## Current Test Setup

The current testing configuration includes:

- **Vitest** for unit tests with:

  - Jest-compatible API
  - React Testing Library integration
  - JSDOM environment for DOM testing
  - Coverage reports with thresholds

- **Playwright** for E2E tests with:
  - Single browser (Chromium) for simplicity
  - Page Object Model for maintainable tests
  - Automatic local dev server startup
  - Screenshot and trace capabilities

## Running All Tests

To run unit tests:

```bash
pnpm test
```

To run both unit and E2E tests:

```bash
pnpm test:all
```

## Testing Best Practices

1. Write tests before or alongside implementation (TDD approach)
2. Focus on testing behavior, not implementation details
3. Test edge cases and error handling
4. Keep tests independent - no test should depend on another test
5. Keep assertions focused and clear
6. Use meaningful test names that describe the expected behavior
7. Consider test performance - fast tests encourage more testing
