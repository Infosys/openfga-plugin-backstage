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
exports.permissionModuleOpenFGAPolicy = void 0;
const policy_1 = require("./policy");
const backend_plugin_api_1 = require("@backstage/backend-plugin-api");
const alpha_1 = require("@backstage/plugin-permission-node/alpha");
exports.permissionModuleOpenFGAPolicy = (0, backend_plugin_api_1.createBackendModule)({
    pluginId: 'permission',
    moduleId: 'openfga-policy',
    register(reg) {
        reg.registerInit({
            deps: {
                config: backend_plugin_api_1.coreServices.rootConfig,
                policy: alpha_1.policyExtensionPoint,
                discovery: backend_plugin_api_1.coreServices.discovery,
            },
            init(_a) {
                return __awaiter(this, arguments, void 0, function* ({ config, policy, discovery }) {
                    policy.setPolicy(new policy_1.OpenFgaCatalogPolicy(config, discovery));
                });
            },
        });
    },
});
