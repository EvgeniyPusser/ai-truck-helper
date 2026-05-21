const OPENROUTER_BASE_URL =
  process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
const OPENROUTER_CHAT_URL = `${OPENROUTER_BASE_URL.replace(/\/$/, "")}/chat/completions`;
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "google/gemma-3-4b-it:free";
const AI_LOCAL_URL =
  process.env.AI_LOCAL_URL ||
  (process.env.OPENROUTER_API_KEY
    ? OPENROUTER_CHAT_URL
    : "http://localhost:1234/v1/chat/completions");
const AI_LOCAL_MODEL =
  process.env.AI_LOCAL_MODEL ||
  (process.env.OPENROUTER_API_KEY ? OPENROUTER_MODEL : "google/gemma-3-4b");
const AI_LOCAL_TIMEOUT_MS = Number(process.env.AI_LOCAL_TIMEOUT_MS || 180000);

export async function askLocalAi(message, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs || AI_LOCAL_TIMEOUT_MS
  );

  try {
    const response = await fetch(AI_LOCAL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.OPENROUTER_API_KEY
          ? {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "HTTP-Referer": process.env.PUBLIC_SITE_URL || "https://holymovela.com",
              "X-Title": "Holy Move",
            }
          : {}),
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: options.model || AI_LOCAL_MODEL,
        messages: [{ role: "user", content: message }],
        temperature: options.temperature ?? 0.2,
        max_tokens: options.maxTokens || 300,
      }),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const error = new Error(`AI upstream HTTP ${response.status}`);
      error.details = data;
      error.status = response.status;
      throw error;
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export function getAiText(response) {
  return response?.choices?.[0]?.message?.content || "";
}
