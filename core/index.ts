/* eslint-disable @typescript-eslint/no-var-requires */

// импортируем существующие JS-модули, ничего не переписывая
const config = require("./shared/config");
const error = require("./shared/middleware/error");
const rateLimit = require("./shared/middleware/rateLimit");
const roles = require("./shared/middleware/roles");
const jwt = require("./shared/utils/jwt");

// единая точка экспорта ядра
export const middleware = { error, rateLimit, roles };
export const utils = { jwt };
export { config };


