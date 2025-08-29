// server/services/providers.js
// Функция принимает объект с параметрами от фронта
export async function findHelpers({ pickupZip, dropoffZip, helpers, volume, date }) {
  // Средняя ставка по США
  let baseRate = 28;

  // Корректировка по дате (выходные +10%)
  const weekend = ["Sat", "Sun"].includes(
    new Date(date).toLocaleString("en-US", { weekday: "short" })
  );
  let rate = weekend ? Math.round(baseRate * 1.1) : baseRate;

  // Корректировка по месту (пример: крупные города +15%)
  // Можно добавить свои ZIP-коды для разных регионов
  const majorZips = ["10001", "90001", "60601"]; // NY, LA, Chicago
  if (majorZips.includes(pickupZip) || majorZips.includes(dropoffZip)) {
    rate = Math.round(rate * 1.15);
  }

  // Корректировка по количеству хелперов (+$5 за каждого сверх 2)
  if (helpers > 2) rate += (helpers - 2) * 5;

  // Корректировка по объёму (+$10 за каждые 10 куб.м сверх 20)
  if (volume > 20) rate += Math.floor((volume - 20) / 10) * 10;

  // Моковые данные
  return [
    { id: "h1", name: "John Doe", rate, source: "Stat", pickupZip, dropoffZip },
    { id: "h2", name: "Mike Smith", rate: rate + 2, source: "Stat", pickupZip, dropoffZip }
  ];
}
