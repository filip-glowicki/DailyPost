import type { Database } from "./utils/supabase/database.types";

/**
 * DTO for Category as returned by GET /categories.
 * This directly corresponds to the "categories" table row in the database.
 */
export type CategoryDTO = Database["public"]["Tables"]["categories"]["Row"];

/**
 * Command model for creating a new category via POST /categories.
 * It excludes the auto-generated "id" field.
 */
export type CreateCategoryCommand = Omit<
  Database["public"]["Tables"]["categories"]["Insert"],
  "id"
>;

/**
 * Command model for updating an existing category via PUT /categories/{id}.
 * The "id" field is required, while "name" and "description" are optionally updated.
 */
export type UpdateCategoryCommand = {
  id: string;
} & Partial<
  Pick<
    Database["public"]["Tables"]["categories"]["Update"],
    "name" | "description"
  >
>;

/**
 * DTO for Post as returned by GET /posts and GET /posts/{id}.
 * This is directly taken from the "posts" table row in the database.
 */
export type PostDTO = Database["public"]["Tables"]["posts"]["Row"];

/**
 * Command model for creating a new post via POST /posts.
 * It excludes fields that are generated automatically: "id", "content", "created_at", "updated_at", and "user_id".
 */
export type CreatePostCommand = Omit<
  Database["public"]["Tables"]["posts"]["Insert"],
  "id" | "content" | "created_at" | "updated_at" | "user_id"
>;

/**
 * Command model for updating an existing post via PUT /posts/{id}.
 * This allows updating the "title", "prompt", "size", "content", and "category_id".
 * The "id" field is required to identify the post to update.
 */
export type UpdatePostCommand = {
  id: string;
} & Partial<
  Pick<
    Database["public"]["Tables"]["posts"]["Update"],
    "title" | "prompt" | "size" | "content" | "category_id"
  >
>;

/**
 * Command model for deleting a post via DELETE /posts/{id}.
 */
export type DeletePostCommand = {
  id: string;
};

/**
 * DTO for Error Log as returned by GET /error-logs (admin-only endpoint).
 * Direct correspondence to the "error_logs" table row in the database.
 */
export type ErrorLogDTO = Database["public"]["Tables"]["error_logs"]["Row"];

/**
 * DTO representing pagination information for paginated GET endpoints.
 */
export type PaginationDTO = {
  page: number;
  limit: number;
  total: number;
};

/**
 * Response DTO for paginated posts.
 */
export type PaginatedPostsDTO = {
  data: PostDTO[];
  pagination: PaginationDTO;
};

/**
 * Response DTO for categories.
 */
export type CategoriesResponseDTO = {
  data: CategoryDTO[];
};

/**
 * Query parameters for GET /posts endpoint.
 */
export type GetPostsQuery = {
  page?: number;
  limit?: number;
  category_id?: string;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
};

/**
 * Command model for deleting a category via DELETE /categories/{id}.
 */
export type DeleteCategoryCommand = {
  id: string;
};
