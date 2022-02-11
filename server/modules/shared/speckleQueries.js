export const userIdQuery = () => `query {
  user {
    id
  },
}`

export const userStreamIdsQuery = ({ userId }) => `{
  user(id: ${JSON.stringify(userId)}) {
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
