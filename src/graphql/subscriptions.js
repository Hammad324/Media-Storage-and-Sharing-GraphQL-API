/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $sub: String
  ) {
    onCreateUser(filter: $filter, sub: $sub) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $sub: String
  ) {
    onUpdateUser(filter: $filter, sub: $sub) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $sub: String
  ) {
    onDeleteUser(filter: $filter, sub: $sub) {
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
export const onCreateFile = /* GraphQL */ `
  subscription OnCreateFile(
    $filter: ModelSubscriptionFileFilterInput
    $userId: String
  ) {
    onCreateFile(filter: $filter, userId: $userId) {
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
export const onUpdateFile = /* GraphQL */ `
  subscription OnUpdateFile(
    $filter: ModelSubscriptionFileFilterInput
    $userId: String
  ) {
    onUpdateFile(filter: $filter, userId: $userId) {
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
export const onDeleteFile = /* GraphQL */ `
  subscription OnDeleteFile(
    $filter: ModelSubscriptionFileFilterInput
    $userId: String
  ) {
    onDeleteFile(filter: $filter, userId: $userId) {
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
