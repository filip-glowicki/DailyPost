import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ShareButton } from "@/components/post/ShareButton";

// Mock window.open
const mockOpen = vi.fn();
Object.defineProperty(window, "open", {
  value: mockOpen,
  writable: true,
});

// Mock toast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe("ShareButton", () => {
  const mockProps = {
    title: "Test Title",
    content: "Test Content",
  };

  beforeEach(() => {
    mockOpen.mockClear();
  });

  it("renders share button correctly", () => {
    const { getByTitle } = render(<ShareButton {...mockProps} />);
    expect(getByTitle("Udostępnij na Twitter")).toBeInTheDocument();
  });

  it("opens Twitter share dialog in new tab when clicked", () => {
    const { getByTitle } = render(<ShareButton {...mockProps} />);
    fireEvent.click(getByTitle("Udostępnij na Twitter"));

    const expectedText = `${mockProps.title}\n\n${mockProps.content}`;
    const expectedUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(expectedText)}`;

    expect(mockOpen).toHaveBeenCalledWith(
      expectedUrl,
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("truncates long content to fit Twitter character limit", () => {
    const longContent = "a".repeat(300);
    const { getByTitle } = render(
      <ShareButton title="Test" content={longContent} />,
    );

    fireEvent.click(getByTitle("Udostępnij na Twitter"));

    const firstCallArgs = mockOpen.mock.calls[0];
    const urlParam = new URL(firstCallArgs[0]).searchParams.get("text");
    expect(urlParam?.length).toBeLessThanOrEqual(280);
  });
});
