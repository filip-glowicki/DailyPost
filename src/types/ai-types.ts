export interface ModelParameters {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

export interface RequestOptions extends ModelParameters {
  model?: string;
}

export interface AdditionalInfo {
  summary?: string;
  wordCount?: number;
  tone?: string;
  [key: string]: string | number | undefined;
}

export interface OpenRouterResponse {
  text: string;
  additionalInfo?: AdditionalInfo;
}

export interface OpenRouterChoice {
  message?: {
    content: string;
  };
  content?: string;
}

export interface OpenRouterApiResponse {
  choices?: OpenRouterChoice[];
  text?: string;
}

export interface CategoryContext {
  name: string;
  description?: string | null;
}
