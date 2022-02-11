<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <h3>Speckle CI</h3>
      </div>
      <v-spacer></v-spacer>

      <v-btn
        outlined
        text
        v-if="!isAuthenticated"
        @click="$store.dispatch('redirectToAuth')"
      >
        <span class="mr-2">Login with Speckle</span>
      </v-btn>
      <v-btn outlined v-else @click="$store.dispatch('logout')">
        Log out {{ $store.state.user.name }}
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },
  },
  data: () => ({
    //
  }),
}
</script>
