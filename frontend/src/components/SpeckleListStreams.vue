<template>
  <div>{{ streams }}</div>
</template>
<script>
import { listAllStreams } from '@/speckleUtils'

export default {
  name: 'SpeckleListStreams',
  data() {
    return {
      streams: null,
    }
  },
  created() {
    this.getStreams()
  },
  methods: {
    getStreams() {
      if (this.$store.getters.isAuthenticated) listAllStreams()
    },
  },
}
</script>
<style></style>
