import fetch from "node-fetch";
import { geocode } from "../services/geocode.js";
import { getRoute } from "../services/route.js";
import { config } from "../config.js"; // config.apiKey, config.baseUrl, config.model

export async function askAI({ from, to, date, volume, needHelpers }) {
  // 1. Геокодируем
  const originCoords = await geocode(from);
  const destCoords = await geocode(to);

  // 2. Получаем маршрут
  const route = await getRoute(originCoords, destCoords);

  // 3. Подготовка промпта
  const systemPrompt = `
Ты логистический AI-помощник по переездам. 
Твоя задача — понять детали переезда и предложить оптимальный план 
с учётом времени, цены и рисков. Не пересчитывай маршрут и стоимость — мы делаем это в коде.
`.trim();

  const userPayload = {
    from,
    to,
    date,
    estimated_volume_m3: volume,
    needHelpers,
    distance_m: route.distance,
    duration_s: route.duration,
  };

  const res = await fetch(config.baseUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(userPayload) },
      ],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ AI service returned error:", errorText);
    throw new Error("Failed to connect to AI service");
  }

  const data = await res.json();
  const content = data.choices[0].message.content;

  let aiResponse;
  try {
    aiResponse = JSON.parse(content);
  } catch (e) {
    console.error("❌ Error parsing AI JSON:", e);
    console.error("⚠️ AI response:", content);
    throw new Error("AI response is not valid JSON");
  }

  // 4. Возвращаем кратко + геометрию отдельно
  return {
    summary: {
      from,
      to,
      distance_km: Number((route.distance / 1000).toFixed(1)),
      duration_min: Math.round(route.duration / 60),
      resources: aiResponse.resources || {},
      pricing: aiResponse.pricing || {},
      narrative: aiResponse.narrative || null,
    },
    geometry: route.geometry, // полный маршрут для карты
  };
}
