export const userInfoQuery = () => `query {
  user {
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
