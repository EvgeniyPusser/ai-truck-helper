import { findHelpers } from "../services/providers.js";

export async function getHelpers(req, res) {
  try {
    // Получаем структуру запроса от фронта
    const { pickupZip, dropoffZip, helpers, volume, rooms, date } = req.body;
    
    // Добавляем логирование для отладки
    console.log('Request data:', { pickupZip, dropoffZip, helpers, volume, rooms, date });
    
    // Формируем ответ через findHelpers
    const result = await findHelpers({ 
      pickupZip, 
      dropoffZip, 
      helpers: helpers || rooms || 2, // используем helpers или rooms, по умолчанию 2
      volume, 
      rooms: rooms || helpers || 1, // используем rooms или helpers, по умолчанию 1
      date 
    });
    
    console.log('Response data:', result);
    
    // Экспортируем ответ обратно во фронт
    res.json(result);
  } catch (err) {
    console.error('Error in getHelpers:', err);
    res.status(500).json({ error: err.message });
  }
}
