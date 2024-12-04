import fetch from 'node-fetch';
import { openFgaConfig } from './openFgaConfig';

interface OpenFgaRequest {
  tuple_key: { user: string; relation: string; object: string };
  authorization_model_id: string;
}

interface OpenFgaResponse {
  allowed: boolean;
  ok?: boolean;
  message: string;
}

let permissionResponse: OpenFgaResponse | null = null;

export function getPermissionResponse(): OpenFgaResponse | null {
  return permissionResponse;
}

const openFgaBaseUrl = openFgaConfig.baseUrl;
const openFgaStoreId = openFgaConfig.storeId;
const authorizationModelId = openFgaConfig.authorizationModelId;

export async function sendPermissionRequest(entityName: string, action: string, userName: any): Promise<OpenFgaResponse> {
  const url = `${openFgaBaseUrl}/stores/${openFgaStoreId}/check`;

  const relation = action.toLowerCase() === 'delete' ? 'catalog_entity_delete' : 'catalog_entity_read';

  const requestBody: OpenFgaRequest = {
    tuple_key: {
      user: `${userName}`,
      relation,
      object: `catalog_entity:${entityName}`,
    },
    authorization_model_id: authorizationModelId,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`OpenFGA API call failed with status: ${response.status}`);
  }

  const data = await response.json() as OpenFgaResponse;
  permissionResponse = data;
  return data;
}

export async function addPolicy(entityName: string, accessType: string, userName: any): Promise<OpenFgaResponse> {
  const url = `${openFgaBaseUrl}/stores/${openFgaStoreId}/write`;

  const requestBody = {
    writes: {
      tuple_keys: [
        {
          _description: `Add ${userName} as ${accessType} on catalog_entity:${entityName}`,
          user: `${userName}`,
          relation: accessType,
          object: `catalog_entity:${entityName}`
        }
      ]
    },
    authorization_model_id: authorizationModelId
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json() as OpenFgaResponse;
  return data;
}

export async function revokePolicy(entityName: string, accessType: string, userName: any): Promise<OpenFgaResponse> {
  const url = `${openFgaBaseUrl}/stores/${openFgaStoreId}/write`;

  const requestBody = {
    deletes: {
      tuple_keys: [
        {
          _description: `Revoke ${userName} as ${accessType} on catalog_entity:${entityName}`,
          user: `${userName}`,
          relation: accessType,
          object: `catalog_entity:${entityName}`
        }
      ]
    },
    authorization_model_id: authorizationModelId
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json() as OpenFgaResponse;
  return data;
}
