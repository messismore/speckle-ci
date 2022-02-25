<template>
  <v-container class="welcome fill-height align-content-center">
    <v-row justify="center" class="mb-10 mb-sm-15">
      <v-sheet max-width="550" color="transparent" class="text-h5 text-sm-h3">
        <v-carousel
          height="auto"
          cycle
          interval="2000"
          hide-delimiters
          :show-arrows="false"
        >
          <v-carousel-item v-for="(claim, i) in claims" :key="i">
            <span class="claim d-flex justify-center text-center">
              {{ claim }}
            </span>
          </v-carousel-item>
        </v-carousel>

        <div class="claim text-center justify-center">
          whenever you send data to a Speckle stream
        </div>
      </v-sheet>
    </v-row>
    <v-row justify="center">
      <v-btn
        x-large
        depressed
        color="primary"
        @click="$store.dispatch('redirectToAuth')"
      >
        <span>Login with Speckle</span>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Welcome',
  data() {
    return {
      claims: ['Export geometry', 'Test your design', 'Call an API'],
    }
  },
}
</script>

<style scoped>
.claim {
  line-height: 1.1;
}
</style>
