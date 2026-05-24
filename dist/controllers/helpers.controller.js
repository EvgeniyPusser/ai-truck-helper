import { getDb, isMongoConfigured } from "../db/mongo.js";
import { askLocalAi, getAiText } from "../services/localAi.js";
import { saveHelperQuoteRequest, updateHelperQuoteAnalysis, } from "../services/helperQuoteRequests.js";
import { getPersistenceState } from "../services/persistenceState.js";
import { findHelpers } from "../services/providers.js";
const helperSaveToken = process.env.HELPER_SAVE_TOKEN || "";
function canSaveHelperRequest(req) {
    if (!isMongoConfigured())
        return false;
    if (helperSaveToken) {
        return req.get("x-helper-save-token") === helperSaveToken;
    }
    return getPersistenceState().saveHelperRequests;
}
async function saveHelperRequest(req, request, result) {
    if (!canSaveHelperRequest(req))
        return null;
    if (!isMongoConfigured())
        return null;
    try {
        const db = getDb();
        const insertResult = await db.collection("helper_requests").insertOne({
            request,
            result,
            resultCount: result.length,
            aiAnalysis: {
                status: "pending",
                createdAt: new Date(),
            },
            createdAt: new Date(),
        });
        return insertResult.insertedId;
    }
    catch (error) {
        console.error("[HolyMove] Failed to save helper request:", error);
        return null;
    }
}
function buildHelperAnalysisPrompt(request, result) {
    const offers = result.map((helper) => ({
        name: helper.name,
        source: helper.source,
        rate: helper.rate,
        rating: helper.rating,
        estimatedTime: helper.estimatedTime,
        truck: helper.truck?.name,
    }));
    return [
        "Analyze this moving request for an internal moving-service dashboard.",
        "Return short practical advice in plain English.",
        "Include: summary, risk level, best offer, and 2-3 recommendations.",
        "",
        `Request: ${JSON.stringify(request)}`,
        `Offers: ${JSON.stringify(offers)}`,
    ].join("\n");
}
async function analyzeAndSaveHelperRequest(id, request, result) {
    if (!id || !isMongoConfigured())
        return;
    const db = getDb();
    try {
        const aiResponse = await askLocalAi(buildHelperAnalysisPrompt(request, result), {
            temperature: 0.2,
            maxTokens: 250,
        });
        const aiText = getAiText(aiResponse);
        await db.collection("helper_requests").updateOne({ _id: id }, {
            $set: {
                aiAnalysis: {
                    status: "completed",
                    text: aiText,
                    model: aiResponse?.model,
                    analyzedAt: new Date(),
                },
            },
        });
    }
    catch (error) {
        await db.collection("helper_requests").updateOne({ _id: id }, {
            $set: {
                aiAnalysis: {
                    status: "failed",
                    error: String(error?.message || error),
                    analyzedAt: new Date(),
                },
            },
        });
    }
}
async function analyzeAndSaveSupabaseRequest(id, request, result) {
    if (!id)
        return;
    try {
        const aiResponse = await askLocalAi(buildHelperAnalysisPrompt(request, result), {
            temperature: 0.2,
            maxTokens: 250,
        });
        const aiText = getAiText(aiResponse);
        await updateHelperQuoteAnalysis(id, {
            aiStatus: "completed",
            aiText,
            aiModel: aiResponse?.model || null,
            aiError: null,
        });
    }
    catch (error) {
        await updateHelperQuoteAnalysis(id, {
            aiStatus: "failed",
            aiError: String(error?.message || error),
        });
    }
}
export async function getHelpers(req, res) {
    try {
        const { pickupZip, dropoffZip, helpers, volume, rooms, date } = req.body;
        const helperRequest = {
            pickupZip,
            dropoffZip,
            helpers: helpers || rooms || 2,
            volume,
            rooms: rooms || helpers || 1,
            date,
        };
        console.log("Request data:", helperRequest);
        const result = await findHelpers(helperRequest);
        const savedSupabaseRequest = await saveHelperQuoteRequest(helperRequest, result);
        const savedRequestId = await saveHelperRequest(req, helperRequest, result);
        analyzeAndSaveSupabaseRequest(savedSupabaseRequest?.id, helperRequest, result);
        analyzeAndSaveHelperRequest(savedRequestId, helperRequest, result);
        console.log("Response data:", result, {
            savedRequestId,
            savedSupabaseRequestId: savedSupabaseRequest?.id,
        });
        res.json(result);
    }
    catch (err) {
        console.error("Error in getHelpers:", err);
        res.status(500).json({ error: err.message });
    }
}
