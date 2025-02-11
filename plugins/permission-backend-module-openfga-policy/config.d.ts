/**
 * This file defines the configuration schema for the OpenFGA plugin.
 */
export interface Config {
  openfga?: {
    /**
     * @visibility frontend
     */
    baseUrl: string;
    /**
     * @visibility frontend
     */
    storeId: string;
    /**
     * @visibility frontend
     */
    authorizationModelId: string;
  };
}
