"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_constants_1 = require("../../constants/enums.constants");
const isSecureRole = (role) => {
    return Object.values(enums_constants_1.UserRoles).includes(role);
};
exports.default = isSecureRole;
