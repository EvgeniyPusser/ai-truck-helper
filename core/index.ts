/* eslint-disable @typescript-eslint/no-var-requires */

// импортируем существующие JS-модули, ничего не переписывая
// import { config } from "./shared/config";
// const error = require("./shared/middleware/error");
// const rateLimit = require("./shared/middleware/rateLimit");
// const roles = require("./shared/middleware/roles");
// const jwt = require("./shared/utils/jwt");

// // единая точка экспорта ядра
// export const middleware = { error, rateLimit, roles };
// export const utils = { jwt };
// export { config };

// ...existing code...
import * as config from "./shared/config";
import * as error from "./shared/middleware/error";
import * as rateLimit from "./shared/middleware/rateLimit";
import * as roles from "./shared/middleware/roles";
import * as jwt from "./shared/utils/jwt";

// единая точка экспорта ядра
export const middleware = { error, rateLimit, roles };
export const utils = { jwt };
export { config };
// ...existing code...


