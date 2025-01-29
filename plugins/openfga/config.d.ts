/**
 * This file defines the configuration schema for the OpenFGA plugin.
 */
export interface Config {
  openfga?: {
    /**
     * @deepVisibility frontend
     */
    baseUrl: string;
    /**
     * @deepVisibility frontend
     */
    storeId: string;
    /**
     * @deepVisibility frontend
     */
    authorizationModelId: string;
  };
}
