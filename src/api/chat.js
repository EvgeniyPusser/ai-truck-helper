import fetch from "node-fetch";

export async function askAI(userMessage) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
Ты логистический AI-помощник по переездам. Твоя задача — понять детали переезда (откуда, куда, дата, список вещей), и вернуть результат строго в формате JSON с расчётом маршрута, объёма, стоимости и советом по грузовику.

Формат ответа:
{
  "from": "город отправления",
  "to": "город назначения",
  "date": "дата переезда (если указана)",
  "truck_size": "small | medium | large",
  "estimated_volume_m3": число,
  "estimated_distance_km": число,
  "helpers_needed": число,
  "estimated_price_usd": число,
  "comments": "короткий совет"
}
        `.trim(),
        },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!res.ok) throw new Error("Failed to connect to OpenRouter");

  const data = await res.json();

  const content = data.choices[0].message.content;

  try {
    const json = JSON.parse(content);
    return json;
  } catch (e) {
    console.error("AI ответ невалидный JSON:", content);
    throw new Error("AI ответ не в формате JSON");
  }
}
