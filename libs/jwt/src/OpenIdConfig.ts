export interface OpenIdConfig {
  authorization_endpoint: string;
  check_session_iframe: string;
  end_session_endpoint: string;
  frontchannel_logout_session_supported: boolean;
  frontchannel_logout_supported: boolean;
  introspection_endpoint: string;
  issuer: string;
  jwks_uri: string;
  revocation_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
}
