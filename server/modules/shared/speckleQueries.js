export const userIdQuery = () => `query {
  user {
    id
  },
}`

export const userStreamIdsQuery = ({ userId }) => `{
  user(id: "${userId}") {
    streams {
      items {
        id
      }
    }
  }
}`
