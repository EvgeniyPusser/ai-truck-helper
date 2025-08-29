import { findHelpers } from "../services/providers.js";

export async function getHelpers(req, res) {
  try {
    // Получаем структуру запроса от фронта
    const { pickupZip, dropoffZip, helpers, volume, date } = req.body;
    // Формируем ответ через findHelpers
    const result = await findHelpers({ pickupZip, dropoffZip, helpers, volume, date });
    // Экспортируем ответ обратно во фронт
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
