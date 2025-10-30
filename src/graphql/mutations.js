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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      username
      email
      role
      isActive
      createdAt
      updatedAt
      files {
        nextToken
        __typename
      }
      sub
      __typename
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      username
      email
      role
      isActive
      createdAt
      updatedAt
      files {
        nextToken
        __typename
      }
      sub
      __typename
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      username
      email
      role
      isActive
      createdAt
      updatedAt
      files {
        nextToken
        __typename
      }
      sub
      __typename
    }
  }
`;
export const createFile = /* GraphQL */ `
  mutation CreateFile(
    $input: CreateFileInput!
    $condition: ModelFileConditionInput
  ) {
    createFile(input: $input, condition: $condition) {
      id
      userId
      filename
      fileUrl
      contentType
      uploadedAt
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateFile = /* GraphQL */ `
  mutation UpdateFile(
    $input: UpdateFileInput!
    $condition: ModelFileConditionInput
  ) {
    updateFile(input: $input, condition: $condition) {
      id
      userId
      filename
      fileUrl
      contentType
      uploadedAt
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteFile = /* GraphQL */ `
  mutation DeleteFile(
    $input: DeleteFileInput!
    $condition: ModelFileConditionInput
  ) {
    deleteFile(input: $input, condition: $condition) {
      id
      userId
      filename
      fileUrl
      contentType
      uploadedAt
      createdAt
      updatedAt
      __typename
    }
  }
`;
