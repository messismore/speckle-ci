<template>
  <v-list-item-icon>
    <v-progress-circular
      v-if="status == 'pending'"
      indeterminate
      size="20"
      width="3"
      color="primary"
    />
    <v-icon v-else-if="status == 'success'" color="success">
      mdi-check-circle
    </v-icon>
    <v-icon v-else-if="status == 'error'" color="error">
      mdi-close-circle
    </v-icon>
    <v-icon v-else color="info"> mdi-circle-outline </v-icon>
  </v-list-item-icon>
</template>

<script>
export default {
  name: 'JobStatusIcon',
  props: {
    status: {
      validator(value) {
        return ['success', 'pending', 'error'].includes(value)
      },
    },
  },
}
</script>

<style scoped></style>
