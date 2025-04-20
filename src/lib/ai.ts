interface ModelParameters {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

interface RequestOptions extends ModelParameters {
  model?: string;
}

interface AdditionalInfo {
  summary?: string;
  wordCount?: number;
  tone?: string;
  [key: string]: string | number | undefined;
}

interface OpenRouterResponse {
  text: string;
  additionalInfo?: AdditionalInfo;
}

interface OpenRouterChoice {
  message?: {
    content: string;
  };
  content?: string;
}

interface OpenRouterApiResponse {
  choices?: OpenRouterChoice[];
  text?: string;
}

/**
 * OpenRouter service for generating AI content
 * Implements the integration with OpenRouter API following the specified plan
 */
export class OpenRouterService {
  #apiToken: string;
  #baseUrl: string;
  #defaultModel: string;
  #defaultModelParameters: ModelParameters;
  #lastResponse: OpenRouterResponse | null;

  constructor() {
    this.#apiToken = process.env.OPENROUTER_API_KEY || "";
    this.#baseUrl =
      process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
    this.#defaultModel = "openai/gpt-4.1-nano";
    this.#defaultModelParameters = {
      temperature: 1,
      max_tokens: 800,
      top_p: 0.95,
    };
    this.#lastResponse = null;
  }

  /**
   * Sends a request to generate content based on the provided prompt and options
   */
  public async sendRequest(
    prompt: string,
    size: string,
    options?: RequestOptions,
  ): Promise<OpenRouterResponse> {
    try {
      const payload = this.#createRequestPayload(prompt, size, options);
      const response = await fetch(`${this.#baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.#apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `OpenRouter API request failed: ${response.statusText}`,
        );
      }

      const data = await response.json();
      const validatedResponse = this.#validateResponse(data);
      this.#lastResponse = validatedResponse;
      return validatedResponse;
    } catch (error) {
      this.#handleError(error as Error);
      throw error;
    }
  }

  /**
   * Updates the default model parameters
   */
  public setModelParameters(params: ModelParameters): void {
    this.#defaultModelParameters = {
      ...this.#defaultModelParameters,
      ...params,
    };
  }

  /**
   * Returns the last received response
   */
  public getLastResponse(): OpenRouterResponse | null {
    return this.#lastResponse;
  }

  #createRequestPayload(
    prompt: string,
    size: string,
    options?: RequestOptions,
  ) {
    // Define size-based token limits and formatting
    const sizeConfig = {
      short: {
        max_tokens: 300,
        format: "Write a concise blog post in 1-2 paragraphs",
      },
      medium: {
        max_tokens: 500,
        format: "Write a detailed blog post in 3-4 paragraphs",
      },
      long: {
        max_tokens: 800,
        format: "Write a comprehensive blog post in 5-6 paragraphs",
      },
    };

    // Get size configuration or default to medium
    const selectedSize =
      sizeConfig[size as keyof typeof sizeConfig] || sizeConfig.medium;

    // Construct the system message with formatting instructions
    const systemMessage = `
Follow these guidelines:
- Format the content in clear paragraphs
- Ensure the content is SEO-friendly
- ${selectedSize.format}
- Focus on providing valuable insights and information
- Add tags at the end of the post
- IMPORTANT: Strictly limit your response to ${selectedSize.max_tokens} tokens`;

    // Construct the user message with prompt and metadata
    const userMessage = `Create a social media post with the following details:
Topic: ${prompt}
Length: ${size} format (maximum ${selectedSize.max_tokens} tokens)
Requirements: 
- Maintain a clear and coherent structure
- Include relevant examples and explanations
- Ensure proper paragraph transitions
- Make the content engaging and informative
- Do not exceed the token limit`;

    // Ensure max_tokens is strictly enforced
    const enforced_max_tokens = Math.min(
      options?.max_tokens || selectedSize.max_tokens,
      selectedSize.max_tokens,
    );

    // Construct the complete payload
    return {
      model: options?.model || this.#defaultModel,
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature:
        options?.temperature || this.#defaultModelParameters.temperature,
      max_tokens: enforced_max_tokens,
      top_p: options?.top_p || this.#defaultModelParameters.top_p,
    };
  }

  #validateResponse(response: OpenRouterApiResponse): OpenRouterResponse {
    // Validate basic response structure
    if (!response || typeof response !== "object") {
      throw new Error("Invalid response format: Response must be an object");
    }

    // Extract the content from OpenRouter response format
    let content = response.choices?.[0]?.message?.content;

    // If content is not found in the expected format, try alternative response formats
    if (!content) {
      // Try direct response format
      content = response.choices?.[0]?.content || response.text;
    }

    if (!content) {
      console.error("Response structure:", JSON.stringify(response, null, 2));
      throw new Error("Invalid response format: Missing content in response");
    }

    // If content is already a string, wrap it in our expected format
    if (typeof content === "string") {
      return {
        text: content,
        additionalInfo: {
          wordCount: content.split(/\s+/).length,
        },
      };
    }

    try {
      // If content is JSON string, parse it
      const parsedContent =
        typeof content === "string" ? JSON.parse(content) : content;

      // Validate required fields
      if (
        typeof parsedContent.text !== "string" &&
        typeof parsedContent === "string"
      ) {
        // If parsedContent is directly a string, use it as the text
        return {
          text: parsedContent,
          additionalInfo: {
            wordCount: parsedContent.split(/\s+/).length,
          },
        };
      }

      if (typeof parsedContent.text !== "string") {
        throw new Error(
          "Invalid response format: Missing or invalid text field",
        );
      }

      // Construct validated response
      const validatedResponse: OpenRouterResponse = {
        text: parsedContent.text,
      };

      // Add additional info if available
      if (
        parsedContent.additionalInfo &&
        typeof parsedContent.additionalInfo === "object"
      ) {
        validatedResponse.additionalInfo = {
          summary:
            typeof parsedContent.additionalInfo.summary === "string"
              ? parsedContent.additionalInfo.summary
              : undefined,
          wordCount:
            typeof parsedContent.additionalInfo.wordCount === "number"
              ? parsedContent.additionalInfo.wordCount
              : parsedContent.text.split(/\s+/).length,
          tone:
            typeof parsedContent.additionalInfo.tone === "string"
              ? parsedContent.additionalInfo.tone
              : undefined,
        };
      }

      return validatedResponse;
    } catch (error) {
      console.error("Failed to parse response:", error);
      console.error("O  riginal response:", JSON.stringify(response, null, 2));
      throw new Error(
        `Failed to parse response content: ${(error as Error).message}`,
      );
    }
  }

  #handleError(error: Error): void {
    // Define error categories for different handling strategies
    const networkErrors = [
      "ECONNREFUSED",
      "ECONNRESET",
      "ETIMEDOUT",
      "fetch failed",
      "network timeout",
    ];

    const authErrors = [
      "unauthorized",
      "invalid token",
      "authentication failed",
      "401",
      "403",
    ];

    const rateLimitErrors = ["rate limit", "too many requests", "429"];

    // Normalize error message for consistent checking
    const errorMessage = error.message.toLowerCase();

    // Handle different error categories
    if (networkErrors.some((e) => errorMessage.includes(e.toLowerCase()))) {
      throw new Error(
        "Network error occurred while communicating with OpenRouter API. Please try again.",
      );
    }

    if (authErrors.some((e) => errorMessage.includes(e.toLowerCase()))) {
      throw new Error(
        "Authentication failed. Please check your API credentials.",
      );
    }

    if (rateLimitErrors.some((e) => errorMessage.includes(e.toLowerCase()))) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    // Handle validation errors
    if (errorMessage.includes("invalid response format")) {
      throw new Error("Failed to process the AI response. Please try again.");
    }

    // Handle unknown errors
    throw new Error("An unexpected error occurred. Please try again later.");
  }
}
