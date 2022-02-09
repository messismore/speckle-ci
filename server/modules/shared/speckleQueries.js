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

export const webhookTriggersQuery = ({ streamId, webhookId }) => `{
 stream(id: ${JSON.stringify(streamId)}) {
   webhooks(id: ${JSON.stringify(webhookId)}) {
     items {
       triggers
     }
   }
 }
}`
