export const userInfoQuery = () => `query {
  user {
    id
    name
  },
  serverInfo {
    name
    company
  }
}`

export const streamSearchQuery = (search) => `query {
  streams(query: "${search}") {
    totalCount
    cursor
    items {
      id
      name
      updatedAt
    }
  }
}`

export const streamListAllQuery = () => `query {
  streams {
    items {
      id
      name
    }
  }
}`
