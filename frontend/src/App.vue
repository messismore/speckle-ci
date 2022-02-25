<template>
  <v-app>
    <v-app-bar flat app elevate-on-scroll elevation="8" class="grey lighten-5">
      <v-app-bar-title>
        <router-link to="/" class="text-decoration-none"
          ><h3>Speckle CI</h3></router-link
        >
      </v-app-bar-title>
      <v-spacer />
      <v-btn v-if="isAuthenticated" text @click="$store.dispatch('logout')">
        Log out {{ $store.state.user.name }}
      </v-btn>
    </v-app-bar>

    <v-main class="grey lighten-5">
      <v-container class="fill-height"> <router-view /> </v-container>
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
}
</script>
