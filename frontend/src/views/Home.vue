<template>
  <v-container class="home fill-height align-start">
    <Welcome v-if="!isAuthenticated" />
    <v-row v-else justify="center">
      <v-col lg="10">
        <p class="body-2 px-4 mb-15 grey--text text--darken-3">
          Create workflows to export geometry, test your design, or call APIs
          whenever you send data to a Speckle stream. Read more on Speckle CI in
          the <a>docs</a>.
        </p>
        <WorkflowList />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Welcome from '@/components/Welcome.vue'
import WorkflowList from '@/components/WorkflowList'

export default {
  name: 'Home',
  components: { Welcome, WorkflowList },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },
  },
}
</script>
