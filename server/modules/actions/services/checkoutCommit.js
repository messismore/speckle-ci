import { fetch } from 'undici'
import ObjectLoader from '@speckle/objectloader'

export default {
  name: 'Checkout Commit',
  description: 'Get the contents of a commit from Speckle.',
  icon: 'mdi-timeline-check-outline',
  inputs: [],
  outputs: [{ name: 'Speckle Data' }],
  run: async ({ context }) => {
    console.log(
      `Imma checkout ${context.commit} from ${context.branchId} on ${context.streamId}`
    )

    const loader = new ObjectLoader({
      ...context,
      objectId: context.commit.objectId,
      options: {
        enableCaching: false,
        excludeProps: [],
        fetch,
      },
    }).getAndConstructObject((e) => console.log('Progress', e))

    const obj = await loader

    return {
      'Speckle Data': obj,
    }
  },
}
