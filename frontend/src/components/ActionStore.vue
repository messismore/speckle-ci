<template>
  <v-card class="pa-5">
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
      // hardcoded for now, eventually provided by backend
      actions: [
        {
          name: 'Checkout Commit',
          description: "I don't actually exist yet. Just testing the UI.",
          icon: 'mdi-timeline-check-outline',
        },
        {
          name: 'Commit Result',
          description: "I don't actually exist yet. Just testing the UI.",
          options: [
            {
              type: 'SELECT',
              id: 'stream',
              label: 'Stream',
              choices: '$streams',
            },
            {
              type: 'SELECT',
              id: 'branch',
              label: 'Branch',
              choices: ['Not', 'implemented', 'yet'],
            },
          ],
        },
        {
          name: 'Call an API',
          description: "I don't actually exist yet. Just testing the UI.",
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
              id: 'request',
              label: 'Request',
            },
          ],
        },
        {
          name: 'Calculate Carbon',
          description: "I don't actually exist yet. Just testing the UI.",
          icon: 'mdi-leaf',
        },
        {
          name: 'Dummy Action',
          description:
            'Does nothing, only writes to the console. Will randomly fail :)',
          icon: 'mdi-flask',
        },
      ],
    }
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
