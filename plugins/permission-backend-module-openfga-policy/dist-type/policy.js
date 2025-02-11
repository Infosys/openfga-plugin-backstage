"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenFgaCatalogPolicy = void 0;
const plugin_permission_common_1 = require("@backstage/plugin-permission-common");
const openFgaPolicyEvaluator_1 = require("./openFgaPolicyEvaluator");
class OpenFgaCatalogPolicy {
    constructor(configApi, discoveryApi) {
        this.openFgaClient = openFgaPolicyEvaluator_1.openFgaPolicyEvaluator.fromConfig(configApi, discoveryApi);
    }
    handle(request, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const identityUser = user;
            // Check if the request is for catalog-entity permissions
            if ((0, plugin_permission_common_1.isResourcePermission)(request.permission, 'catalog-entity')) {
                if (request.permission.name === 'catalog.entity.delete') {
                    // Currently entityName is hardcoded, Load Entity based on the entity selection if possible
                    const entityName = 'example-website';
                    const userName = identityUser === null || identityUser === void 0 ? void 0 : identityUser.identity.ownershipEntityRefs;
                    if (!entityName) {
                        // If entity name is not provided, deny the permission
                        return { result: plugin_permission_common_1.AuthorizeResult.DENY };
                    }
                    try {
                        // Send a permission request to the OpenFGA API using the client instance
                        const response = yield this.openFgaClient.sendPermissionRequest(entityName, 'Delete', userName);
                        // Return ALLOW or DENY based on the response from the OpenFGA API
                        return response.allowed
                            ? { result: plugin_permission_common_1.AuthorizeResult.ALLOW }
                            : { result: plugin_permission_common_1.AuthorizeResult.DENY };
                    }
                    catch (error) {
                        console.error('Error checking permission:', error);
                        return { result: plugin_permission_common_1.AuthorizeResult.DENY };
                    }
                }
                // For other catalog-entity permissions, you can add additional conditions here
                return { result: plugin_permission_common_1.AuthorizeResult.ALLOW };
            }
            // Deny all other permissions by default
            return { result: plugin_permission_common_1.AuthorizeResult.DENY };
        });
    }
}
exports.OpenFgaCatalogPolicy = OpenFgaCatalogPolicy;
