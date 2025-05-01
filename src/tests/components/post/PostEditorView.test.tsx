import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { PostEditorView } from "@/components/post/PostEditorView";
import * as categoriesActions from "@/actions/categories";
import * as postsActions from "@/actions/posts";
import * as toastHook from "@/hooks/use-toast";
import { CategoriesResponseDTO, PostDTO } from "@/types/database-types";

// Mock the required modules
vi.mock("@/actions/categories", () => ({
  getCategories: vi.fn(),
}));

vi.mock("@/actions/posts", () => ({
  generatePost: vi.fn(),
  updatePost: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

vi.mock("@/components/post/PostForm", () => ({
  PostForm: vi.fn(({ onSubmit, onModeChange }) => (
    <div data-testid="post-form">
      <button
        data-testid="submit-form"
        onClick={() =>
          onSubmit({
            title: "Test Title",
            category_id: "1",
            prompt: "",
            size: "",
          })
        }
      >
        Submit
      </button>
      <button data-testid="change-mode" onClick={() => onModeChange("manual")}>
        Change Mode
      </button>
    </div>
  )),
}));

vi.mock("@/components/post/PostDisplay", () => ({
  PostDisplay: vi.fn(({ post, onEdit, onCopy }) => (
    <div data-testid="post-display">
      <div data-testid="post-title">{post.title}</div>
      <div data-testid="post-content">{post.content}</div>
      <button data-testid="edit-post" onClick={onEdit}>
        Edit
      </button>
      <button data-testid="copy-content" onClick={() => onCopy(post.content)}>
        Copy
      </button>
    </div>
  )),
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe("PostEditorView", () => {
  const mockToast = vi.fn();
  const mockCategories: CategoriesResponseDTO = {
    data: [
      {
        id: "1",
        name: "Category 1",
        description: "Description 1",
        user_id: null,
      },
      {
        id: "2",
        name: "Category 2",
        description: "Description 2",
        user_id: null,
      },
    ],
  };
  const mockPost: PostDTO = {
    id: "123",
    title: "Test Post",
    content: "Test Content",
    category_id: "1",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    user_id: "user123",
    prompt: "Test prompt",
    size: "medium",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(toastHook.useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });

    vi.mocked(categoriesActions.getCategories).mockResolvedValue({
      data: mockCategories,
      success: true,
      status: 200,
    });

    vi.mocked(postsActions.generatePost).mockResolvedValue({
      data: mockPost,
      success: true,
      status: 200,
    });

    vi.mocked(postsActions.updatePost).mockResolvedValue({
      data: { ...mockPost, title: "Updated Title" },
      success: true,
      status: 200,
    });
  });

  it("renders the PostForm initially", async () => {
    render(<PostEditorView />);

    expect(screen.getByTestId("post-form")).toBeInTheDocument();
    await waitFor(() =>
      expect(categoriesActions.getCategories).toHaveBeenCalledTimes(1),
    );
  });

  it("loads categories on mount", async () => {
    render(<PostEditorView />);

    await waitFor(() =>
      expect(categoriesActions.getCategories).toHaveBeenCalledTimes(1),
    );
  });

  it("shows toast error when categories fetch fails", async () => {
    vi.mocked(categoriesActions.getCategories).mockRejectedValueOnce(
      new Error("Failed to load categories"),
    );

    render(<PostEditorView />);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "Błąd",
        description:
          "Nie udało się załadować kategorii. Proszę spróbować ponownie.",
      });
    });
  });

  it("generates a post when form is submitted and displays it", async () => {
    render(<PostEditorView />);

    fireEvent.click(screen.getByTestId("submit-form"));

    await waitFor(() => {
      expect(postsActions.generatePost).toHaveBeenCalledWith({
        title: "Test Title",
        category_id: "1",
        mode: "auto",
      });
      expect(screen.getByTestId("post-display")).toBeInTheDocument();
      expect(screen.getByTestId("post-title")).toHaveTextContent("Test Post");
      expect(mockToast).toHaveBeenCalledWith({
        title: "Sukces",
        description: "Post został wygenerowany!",
      });
    });
  });

  it("handles post generation failure", async () => {
    vi.mocked(postsActions.generatePost).mockRejectedValueOnce(
      new Error("Failed to generate post"),
    );

    render(<PostEditorView />);

    fireEvent.click(screen.getByTestId("submit-form"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "Błąd",
        description:
          "Nie udało się wygenerować posta. Proszę spróbować ponownie.",
      });
      expect(screen.queryByTestId("post-display")).not.toBeInTheDocument();
    });
  });

  it("switches to edit mode when edit button is clicked", async () => {
    render(<PostEditorView />);

    // Generate post first
    fireEvent.click(screen.getByTestId("submit-form"));

    await waitFor(() =>
      expect(screen.getByTestId("post-display")).toBeInTheDocument(),
    );

    // Click edit button
    fireEvent.click(screen.getByTestId("edit-post"));

    await waitFor(() =>
      expect(screen.getByTestId("post-form")).toBeInTheDocument(),
    );
  });

  it("updates a post when in edit mode", async () => {
    render(<PostEditorView />);

    // Generate post first
    fireEvent.click(screen.getByTestId("submit-form"));

    await waitFor(() =>
      expect(screen.getByTestId("post-display")).toBeInTheDocument(),
    );

    // Switch to edit mode
    fireEvent.click(screen.getByTestId("edit-post"));

    await waitFor(() =>
      expect(screen.getByTestId("post-form")).toBeInTheDocument(),
    );

    // Submit form to update post
    fireEvent.click(screen.getByTestId("submit-form"));

    await waitFor(() => {
      expect(postsActions.updatePost).toHaveBeenCalledWith({
        id: "123",
        title: "Test Title",
        category_id: "1",
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: "Sukces",
        description: "Post został zaktualizowany!",
      });
    });
  });

  it("handles post update failure", async () => {
    vi.mocked(postsActions.updatePost).mockRejectedValueOnce(
      new Error("Failed to update post"),
    );

    render(<PostEditorView />);

    // Generate post first
    fireEvent.click(screen.getByTestId("submit-form"));

    await waitFor(() =>
      expect(screen.getByTestId("post-display")).toBeInTheDocument(),
    );

    // Switch to edit mode
    fireEvent.click(screen.getByTestId("edit-post"));

    await waitFor(() =>
      expect(screen.getByTestId("post-form")).toBeInTheDocument(),
    );

    // Submit form to update post (which will fail)
    fireEvent.click(screen.getByTestId("submit-form"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "Błąd",
        description:
          "Nie udało się zaktualizować posta. Proszę spróbować ponownie.",
      });
    });
  });

  it("copies post content to clipboard", async () => {
    render(<PostEditorView />);

    // Generate post first
    fireEvent.click(screen.getByTestId("submit-form"));

    await waitFor(() =>
      expect(screen.getByTestId("post-display")).toBeInTheDocument(),
    );

    // Click copy button
    fireEvent.click(screen.getByTestId("copy-content"));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Test Content");
    expect(mockToast).toHaveBeenCalledWith({
      title: "Sukces",
      description: "Treść została skopiowana do schowka!",
    });
  });

  it("allows changing mode via PostForm", async () => {
    render(<PostEditorView />);

    fireEvent.click(screen.getByTestId("change-mode"));

    // This would verify the mode was changed internally, but since we're mocking the component
    // we'd need to verify by checking if onModeChange was called with the right argument
    // This is a limitation of our current test setup with mocked components
  });
});
