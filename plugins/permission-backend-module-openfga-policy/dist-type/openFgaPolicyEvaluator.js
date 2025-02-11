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
exports.openFgaPolicyEvaluator = void 0;
const errors_1 = require("@backstage/errors");
class openFgaPolicyEvaluator {
    static fromConfig(configApi, discoveryApi) {
        var _a, _b, _c;
        const baseUrl = (_a = configApi.getOptionalString('openfga.baseUrl')) !== null && _a !== void 0 ? _a : '';
        const storeId = (_b = configApi.getOptionalString('openfga.storeId')) !== null && _b !== void 0 ? _b : '';
        const authorizationModelId = (_c = configApi.getOptionalString('openfga.authorizationModelId')) !== null && _c !== void 0 ? _c : '';
        if (!storeId || !authorizationModelId) {
            console.error('Missing configuration values for OpenFGA. Please check your app-config.yaml.');
        }
        return new openFgaPolicyEvaluator({
            discoveryApi,
            baseUrl,
            storeId,
            authorizationModelId,
        });
    }
    constructor(opts) {
        this.discoveryApi = opts.discoveryApi;
        this.baseUrl = opts.baseUrl;
        this.storeId = opts.storeId;
        this.authorizationModelId = opts.authorizationModelId;
        this.permissionResponse = null;
    }
    getPermissionResponse() {
        return this.permissionResponse;
    }
    fetch(input, init) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiUrl = `${this.baseUrl}${input}`;
            const response = yield fetch(apiUrl, init);
            if (!response.ok) {
                throw yield errors_1.ResponseError.fromResponse(response);
            }
            return yield response.json();
        });
    }
    sendPermissionRequest(entityName, action, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/stores/${this.storeId}/check`;
            const relation = typeof action === 'string' && action.toLowerCase() === 'delete'
                ? 'catalog_entity_delete'
                : 'catalog_entity_read';
            const requestBody = {
                tuple_key: {
                    user: `${userName}`,
                    relation,
                    object: `catalog_entity:${entityName}`,
                },
                authorization_model_id: this.authorizationModelId,
            };
            const response = yield this.fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });
            this.permissionResponse = response;
            return response;
        });
    }
    addPolicy(entityName, accessType, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/stores/${this.storeId}/write`;
            const requestBody = {
                writes: {
                    tuple_keys: [
                        {
                            user: `${userName}`,
                            relation: accessType,
                            object: `catalog_entity:${entityName}`,
                        },
                    ],
                },
                authorization_model_id: this.authorizationModelId,
            };
            const response = yield this.fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });
            return response;
        });
    }
    revokePolicy(entityName, accessType, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/stores/${this.storeId}/write`;
            const requestBody = {
                deletes: {
                    tuple_keys: [
                        {
                            user: `${userName}`,
                            relation: accessType,
                            object: `catalog_entity:${entityName}`,
                        },
                    ],
                },
                authorization_model_id: this.authorizationModelId,
            };
            const response = yield this.fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });
            return response;
        });
    }
}
exports.openFgaPolicyEvaluator = openFgaPolicyEvaluator;
