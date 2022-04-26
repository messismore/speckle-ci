export default {
  name: 'Dummy Action',
  description:
    'Will log a bunch of stuff to the console and fail with a 50/50 chance.',
  icon: 'mdi-timeline-check-outline',
  inputs: [],
  run: function ({ context }) {
    console.log(
      `Running Workflow "${this.workflow.name}". This is the context:`,
      context
    )
    console.log(`And this is the this:`, this)

    if (Math.floor(Math.random() * 2))
      throw new Error('Oh no! dummyAction failed!')

    return {
      dummyResult: '🏠',
    }
  },
}
