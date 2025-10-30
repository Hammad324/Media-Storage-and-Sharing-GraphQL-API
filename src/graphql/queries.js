/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const _dummy = /* GraphQL */ `
  query _dummy {
    _dummy
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        email
        role
        isActive
        createdAt
        updatedAt
        sub
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getFile = /* GraphQL */ `
  query GetFile($id: ID!) {
    getFile(id: $id) {
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
export const listFiles = /* GraphQL */ `
  query ListFiles(
    $filter: ModelFileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const filesByUserId = /* GraphQL */ `
  query FilesByUserId(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelFileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    filesByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
