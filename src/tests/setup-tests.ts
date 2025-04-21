import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js navigation
vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
    }),
    useParams: () => ({}),
    usePathname: () => "",
    useSearchParams: () => ({
      get: vi.fn(),
      has: vi.fn(),
    }),
  };
});

// Setup global fetch mock
global.fetch = vi.fn();

// Other global mocks can be added here as needed
