const mockResponses = {
  short: (prompt: string) =>
    `Short post about "${prompt}": This is a brief mock response for testing purposes. It simulates a concise AI-generated content that would typically be 2-3 sentences long.`,
  medium: (prompt: string) =>
    `Medium post about "${prompt}": This is a more detailed mock response that spans multiple sentences. It simulates a moderate-length AI-generated content with some additional context and details. The response includes enough text to demonstrate how a typical medium-sized post would look.`,
  long: (prompt: string) =>
    `Long post about "${prompt}": This is an extensive mock response that provides a comprehensive treatment of the topic. It simulates a lengthy AI-generated content with multiple paragraphs and detailed explanations. The response includes various aspects and perspectives on the topic, making it suitable for in-depth content. This mock response demonstrates how a long-form post would be structured and formatted. It includes enough text to test UI rendering and content display mechanisms.`,
};

export async function generateContent(prompt: string, size: string) {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Get appropriate mock response based on size
  const mockResponse =
    mockResponses[size as keyof typeof mockResponses] || mockResponses.medium;
  const content = mockResponse(prompt);

  // Return in the same format as the API would
  return content;
}
