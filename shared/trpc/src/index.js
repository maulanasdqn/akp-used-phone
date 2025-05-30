"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const app_1 = require("@/shared/api/app");
const utils_1 = require("@/shared/api/utils");
exports.appRouter = (0, utils_1.createTRPCInstance)({
    users: app_1.usersService,
    roles: app_1.rolesService,
    permissions: app_1.permissionsService,
    products: app_1.productsService,
});
