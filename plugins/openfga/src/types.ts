export interface OpenFgaRequest {
    tuple_key: { user: string; relation: string; object: string };
    authorization_model_id: string;
  }
  
  export interface OpenFgaResponse {
    allowed: boolean;
    ok?: boolean;
    message: string;
  }
