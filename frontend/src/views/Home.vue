<template>
  <div class="home">
    <h1>Hello World</h1>
    <SpeckleListStreams />
  </div>
</template>

<script>
import SpeckleListStreams from '@/components/SpeckleListStreams'

export default {
  name: 'Home',

  components: { SpeckleListStreams },
}
</script>
