import { fetchSpeckleBranchCommitMessage } from '/app/modules/shared/speckleUtils.js'

export default {
  name: 'Test Setbacks',
  description: 'Check if volumes follows envelope restrictions.',
  icon: 'mdi-domain',
  options: [],
  outputs: [],
  run: async ({ inputs, context }) => {
    /*
      We're mocking this until Speckle plays nice with Rhino.Compute https://speckle.community/t/running-speckle-on-rhino-compute/2225

      */

    // Wait for external service to commit to "setback check"
    await new Promise((resolve) => setTimeout(resolve, 5000))

    const commitMessage = fetchSpeckleBranchCommitMessage({
      token: this.workflow.speckleAuthToken,
      streamId: context.streamId,
      branchName: 'setback check',
    })

    // Parse commit message
    if (!commitMessage.includes('passed'))
      throw new Error('Check Setback failed')

    return {}
  },
}
