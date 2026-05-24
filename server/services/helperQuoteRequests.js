import { prisma } from "../db/prisma.js";

function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export async function saveHelperQuoteRequest(request, response) {
  if (!prisma) return null;

  try {
    return await prisma.helperQuoteRequest.create({
      data: {
        pickupZip: String(request.pickupZip || ""),
        dropoffZip: String(request.dropoffZip || ""),
        helpers: numberOrNull(request.helpers),
        rooms: numberOrNull(request.rooms),
        volume: numberOrNull(request.volume),
        moveDate: request.date || null,
        request,
        response,
        resultCount: Array.isArray(response) ? response.length : 0,
        aiStatus: "pending",
      },
    });
  } catch (error) {
    console.error("[HolyMove] Failed to save Supabase helper quote request:", error);
    return null;
  }
}

export async function updateHelperQuoteAnalysis(id, analysis) {
  if (!prisma || !id) return;

  try {
    await prisma.helperQuoteRequest.update({
      where: { id },
      data: analysis,
    });
  } catch (error) {
    console.error("[HolyMove] Failed to update Supabase helper quote analysis:", error);
  }
}
