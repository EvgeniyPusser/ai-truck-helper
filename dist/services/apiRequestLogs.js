import { prisma } from "../db/prisma.js";
import { truncateJson } from "./json.js";
function shouldLogRequest(req) {
    return Boolean(prisma) && req.path.startsWith("/api/");
}
export async function saveApiRequestLog(entry) {
    if (!prisma)
        return null;
    try {
        return await prisma.apiRequestLog.create({
            data: {
                method: entry.method,
                path: entry.path,
                statusCode: entry.statusCode,
                durationMs: entry.durationMs,
                origin: entry.origin || null,
                ip: entry.ip || null,
                userAgent: entry.userAgent || null,
                query: truncateJson(entry.query),
                requestBody: truncateJson(entry.requestBody),
                responseBody: truncateJson(entry.responseBody),
                error: entry.error || null,
            },
        });
    }
    catch (error) {
        console.error("[HolyMove] Failed to save API request log:", error);
        return null;
    }
}
export function apiRequestLogger(req, res, next) {
    if (!shouldLogRequest(req))
        return next();
    const startedAt = Date.now();
    let responseBody = null;
    let responseError = null;
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);
    res.json = (body) => {
        responseBody = body;
        return originalJson(body);
    };
    res.send = (body) => {
        if (responseBody == null) {
            responseBody = body;
        }
        return originalSend(body);
    };
    res.on("finish", () => {
        void saveApiRequestLog({
            method: req.method,
            path: req.originalUrl || req.url,
            statusCode: res.statusCode,
            durationMs: Date.now() - startedAt,
            origin: req.get("origin"),
            ip: req.ip,
            userAgent: req.get("user-agent"),
            query: req.query,
            requestBody: req.body,
            responseBody,
            error: responseError,
        });
    });
    res.on("error", (error) => {
        responseError = String(error?.message || error);
    });
    next();
}
