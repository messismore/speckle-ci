export default {
  name: 'Get Value',
  description: 'Get the result of a previous action.',
  icon: 'mdi-shape-outline',
  options: [
    {
      type: 'SELECT',
      id: 'value',
      label: 'Result',
      choices: '$results',
    },
  ],
  outputs: [{ name: 'Value' }],
  run: async ({ inputs, context }) => ({ Value: inputs.value }),
}
