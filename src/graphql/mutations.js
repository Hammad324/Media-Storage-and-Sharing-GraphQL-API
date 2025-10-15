/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const register = /* GraphQL */ `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      success
      message
      __typename
    }
  }
`;
export const login = /* GraphQL */ `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      idToken
      accessToken
      refreshToken
      message
      __typename
    }
  }
`;
export const logout = /* GraphQL */ `
  mutation Logout {
    logout {
      success
      message
      __typename
    }
  }
`;
export const getUploadUrl = /* GraphQL */ `
  mutation GetUploadUrl($input: GetUploadUrlInput!) {
    getUploadUrl(input: $input) {
      success
      signedUrl
      fileUrl
      error
      __typename
    }
  }
`;
export const rotateTokens = /* GraphQL */ `
  mutation RotateTokens {
    rotateTokens {
      idToken
      accessToken
      refreshToken
      message
      __typename
    }
  }
`;
