import { fetch } from 'undici'

export default {
  name: 'Call a Web API',
  description: 'Make a HTTP request to a web endpoint.',
  icon: 'mdi-radio-tower',
  options: [
    {
      type: 'SELECT',
      id: 'method',
      label: 'Method',
      choices: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      default: 'GET',
    },
    {
      type: 'TEXT',
      id: 'url',
      label: 'url',
    },
    {
      type: 'MULTILINE',
      id: 'header',
      label: 'Request Header',
    },
    {
      type: 'MULTILINE',
      id: 'body',
      label: 'Body',
    },
  ],
  outputs: [{ name: 'Server Response' }],
  run: async ({ inputs, context }) => {
    console.log('Web Request: ', inputs)
    const response = await fetch(inputs.url, {
      method: inputs.method,
      mode: 'cors',
      cache: 'no-cache',
      headers: JSON.parse(
        (inputs.header ??= "{ 'Content-Type': 'application/json' }")
      ),
      redirect: 'follow',
      body: (inputs.body ??= '{}'),
    })

    return { 'Server Response': response.statusText }
  },
}
