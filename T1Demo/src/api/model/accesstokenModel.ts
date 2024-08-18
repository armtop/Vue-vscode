export interface TokenListResult {
  list: Array<TokenModel>;
}
export interface TokenModel {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}
