<template>
  <v-progress-linear v-if="loading" indeterminate color="accent" />
  <v-card v-else class="pa-5">
    <v-card-title>
      <h3 class="text-h6">Add an action</h3>
    </v-card-title>
    <v-card-text> Workflows are composed of a chain of actions. </v-card-text>
    <v-item-group class="action-grid">
      <v-item v-for="(action, i) in this.actions" :key="i">
        <v-card outlined class="d-flex flex-column" @click="pushAction(action)">
          <v-icon class="ma-4 mb-2 align-self-start">
            {{ action.icon ? action.icon : 'mdi-robot' }}
          </v-icon>
          <v-card-title
            class="text-subtitle-1 font-weight-medium overflow-wrap-break-word"
          >
            {{ action.name }}
          </v-card-title>
          <v-card-text>
            {{ action.description }}
          </v-card-text>
        </v-card>
      </v-item>
    </v-item-group>
  </v-card>
</template>

<script>
export default {
  name: 'ActionStore',
  props: {
    recipe: { type: Array, required: true },
  },
  data() {
    return {
      loading: true,
      errored: false,
    }
  },
  computed: {
    actions() {
      return this.$store.state.actions
    },
  },
  async mounted() {
    await this.$store.dispatch('getActions')
    this.loading = false
  },
  methods: {
    pushAction(action) {
      this.recipe.push(action)
      this.$emit('choseAction', action)
    },
  },
}
</script>

<style scoped>
.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  grid-gap: 1rem;
}
.overflow-wrap-break-word {
  word-break: normal;
  overflow-wrap: break-word;
}
</style>
