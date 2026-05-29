export function toPrismaJson(value) {
    if (value === undefined)
        return null;
    try {
        return JSON.parse(JSON.stringify(value));
    }
    catch {
        return {
            serializationError: "Value could not be converted to JSON.",
        };
    }
}
export function truncateJson(value, maxLength = 50000) {
    const jsonValue = toPrismaJson(value);
    const text = JSON.stringify(jsonValue);
    if (!text || text.length <= maxLength)
        return jsonValue;
    return {
        truncated: true,
        originalLength: text.length,
        preview: text.slice(0, maxLength),
    };
}
