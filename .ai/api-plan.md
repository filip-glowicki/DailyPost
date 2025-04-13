# REST API Plan

## 1. Resources

- **Users**: Managed by Supabase Auth. Contains at least the `id` field. All user authentication and identification are handled externally.
- **Categories**: Maps to the `Categories` table.
  - Fields: `id` (UUID), `name` (TEXT), `description` (TEXT, max 250 characters).
- **Posts**: Maps to the `Posts` table.
  - Fields: `id` (UUID), `user_id` (UUID), `title` (TEXT), `prompt` (TEXT, max 500 characters), `size` (TEXT), `content` (TEXT, max 1000 characters), `category_id` (UUID), `created_at`, `updated_at`.
- **Error Logs**: Maps to the `Error_logs` table.
  - Fields: `id`, `user_id` (optional), `error_message`, `error_context`, `created_at`.
  - Note: Not exposed to regular users; used for internal diagnostics and system monitoring.

## 2. Endpoints

### Posts Endpoints

1. **GET /posts**

   - **Description**: Retrieve a list of posts.
   - **Query Parameters**:
     - `page` (number, optional): For pagination.
     - `limit` (number, optional): Number of records per page.
     - `category_id` (UUID, optional): Filter posts by category.
     - `search` (string, optional): Keyword search in the title or content.
     - `sortBy` (string, optional): Field to sort by (e.g., `created_at`, `title`).
     - `order` (string, optional): Sorting order (`asc` or `desc`).
   - **Response**:
     ```json
     {
       "data": [
         {
           "id": "uuid",
           "title": "string",
           "prompt": "string",
           "size": "string",
           "content": "string",
           "category_id": "uuid",
           "created_at": "timestamp",
           "updated_at": "timestamp"
         }
       ],
       "pagination": { "page": 1, "limit": 10, "total": 100 }
     }
     ```
   - **Success Codes**: 200 OK
   - **Error Codes**: 400 Bad Request, 401 Unauthorized

2. **GET /posts/{id}**

   - **Description**: Retrieve a specific post by its ID.
   - **Response**: Post object as defined above.
   - **Success Codes**: 200 OK
   - **Error Codes**: 404 Not Found, 401 Unauthorized

3. **POST /posts**

   - **Description**: Automatically generate a post using AI (e.g., GPT-4o mini).
   - **Request Body**:
     ```json
     {
       "title": "string",
       "prompt": "string",
       "size": "string",
       "category_id": "uuid"
     }
     ```
   - **Business Logic**:
     - Integrates with an external AI service to generate content based on the provided prompt.
     - Validates input limits.
   - **Response**: Newly created post with generated `content`.
   - **Success Codes**: 201 Created
   - **Error Codes**: 400 Bad Request, 401 Unauthorized, 500 Internal Server Error (for AI integration issues)

4. **PUT /posts/{id}**

   - **Description**: Update an existing post.
   - **Request Body**: Fields to update (e.g., `title`, `prompt`, `size`, `content`, `category_id`).
   - **Business Logic**:
     - Ensures that the post belongs to the authenticated user.
     - Validates character limits.
     - Automatically updates the `updated_at` field.
   - **Response**: Updated post object.
   - **Success Codes**: 200 OK
   - **Error Codes**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found

5. **DELETE /posts/{id}**

   - **Description**: Delete a post.
   - **Business Logic**:
     - Checks that the authenticated user is the owner of the post.
   - **Response**: Success message.
   - **Success Codes**: 200 OK
   - **Error Codes**: 401 Unauthorized, 403 Forbidden, 404 Not Found

### Categories Endpoints

1. **GET /categories**

   - **Description**: Retrieve a list of categories.
   - **Response**:
     ```json
     {
       "data": [{ "id": "uuid", "name": "string", "description": "string" }]
     }
     ```
   - **Success Codes**: 200 OK

2. **POST /categories**

   - **Description**: Create a new category.
   - **Request Body**:
     ```json
     {
       "name": "string",
       "description": "string"
     }
     ```
   - **Business Logic**:
     - Ensures the `description` does not exceed 250 characters.
   - **Response**: Created category object.
   - **Success Codes**: 201 Created
   - **Error Codes**: 400 Bad Request, 401 Unauthorized

3. **PUT /categories/{id}**

   - **Description**: Update an existing category.
   - **Request Body**: Fields to update (i.e., `name`, `description`).
   - **Response**: Updated category object.
   - **Success Codes**: 200 OK
   - **Error Codes**: 400 Bad Request, 401 Unauthorized, 404 Not Found

4. **DELETE /categories/{id}**
   - **Description**: Delete a category.
   - **Response**: Success message.
   - **Success Codes**: 200 OK
   - **Error Codes**: 401 Unauthorized, 404 Not Found

### Error Logs Endpoints (Admin Only)

1. **GET /error-logs**
   - **Description**: Retrieve error logs for system diagnostics.
   - **Business Logic**: Accessible only by admin users.
   - **Response**:
     ```json
     {
       "data": [
         {
           "id": "uuid",
           "user_id": "uuid",
           "error_message": "string",
           "error_context": "string",
           "created_at": "timestamp"
         }
       ]
     }
     ```
   - **Success Codes**: 200 OK
   - **Error Codes**: 401 Unauthorized, 403 Forbidden

## 3. Authentication and Authorization

- **Authentication**:
  - All endpoints (except for public read-only endpoints) require authentication via a JWT token provided by Supabase Auth.
  - The token should be included in the `Authorization` header as a Bearer token.
- **Authorization**:
  - Modifications to Posts and Categories are permitted only if the authenticated user owns or has permission to modify the resource.
  - Admin-only endpoints (e.g., error logs) require additional role verification.

## 4. Validation and Business Logic

- **Field Validations**:
  - `prompt`: Maximum of 500 characters.
  - `content`: Maximum of 1000 characters.
  - Category `description`: Maximum of 250 characters.
- **Business Logic**:
  - **Automatic Content Generation**:
    - The `/posts` POST endpoint integrates with an external OpenRouter AI service to generate post content based on the provided prompt, size and category description.
  - **Manual Editing**:
    - Posts can be freely updated without versioning; previous versions are not stored.
  - **Sharing**:
    - Unique share URLs are generated on Client Side (MVP verison) for each post to facilitate social sharing on platforms such as X and Facebook.
  - **Pagination, Filtering, and Sorting**:
    - GET endpoints support query parameters for managing pagination, filtering (e.g., by `category_id`), and sorting (e.g., by `created_at` or `title`).
  - **Security Measures**:
    - Rate limiting, input sanitization, and error logging are implemented to protect against abuse and ensure system integrity.

## 5. Assumptions and Considerations

- The API is built within the Next.js framework leveraging Supabase as the backend service.
- External AI integration delegates post content generation to the configured AI service (e.g., GPT-4o mini via OpenRouter).
- User authentication and authorization are managed primarily by Supabase Auth, with endpoints verifying ownership where necessary.
- All endpoints adhere to RESTful principles, ensuring a clear separation between resources and their respective operations.
