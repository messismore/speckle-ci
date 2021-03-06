<template>
  <v-container class="home fill-height align-start">
    <v-row justify="center">
      <v-col lg="10">
        <v-card class="rounded-lg pb-2" elevation="4">
          <v-row class="px-4 pb-2">
            <v-card-title>{{
              workflowName ? workflowName : 'Loading workflow runs…'
            }}</v-card-title>
            <v-spacer></v-spacer>
            <v-card-actions>
              <v-btn depressed color="primary" :to="$route.path + '/edit'">
                Edit workflow
              </v-btn>
            </v-card-actions>
          </v-row>
          <v-divider />

          <section v-if="errored">
            <p>Couldn't load runs. Please try to refresh the page.</p>
          </section>
          <section v-else>
            <div v-if="loading">
              <v-progress-linear indeterminate color="accent" />
            </div>

            <v-list flat>
              <v-card-subtitle
                v-if="!loading && (!runs || !runs.length)"
                justify="center"
              >
                <p>This workflow has not run yet</p>
              </v-card-subtitle>
              <v-list-item-group
                v-else
                v-for="(run, i) in runs"
                :key="run.createdAt + i /* sort by date, i*/"
              >
                <v-list-item inactive :ripple="false">
                  <JobStatusIcon :status="run.status" />

                  <v-list-item-content>
                    <v-list-item-title
                      v-text="
                        run.triggerEvent &&
                        run.triggerEvent.commit &&
                        run.triggerEvent.commit.message
                          ? run.triggerEvent.commit.message
                          : 'Unknown Event' /* no optional chaining in Vue2 */
                      "
                    />
                    <v-list-item-subtitle
                      v-text="
                        run.triggerEvent && run.triggerEvent.name
                          ? run.triggerEvent.eventName
                          : ''
                      "
                    ></v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-content>
                    <v-list-item-subtitle>
                      {{
                        run.createdAt
                          .slice(0, 16)
                          .replaceAll('T', ' ')
                          .replaceAll('-', '.')
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn
                      v-if="run.report"
                      small
                      depressed
                      outlined
                      :href="`${backend}/reports/${run._id}`"
                      target="_blank"
                    >
                      Show Report
                    </v-btn>
                    <v-btn v-else disabled small depressed outlined>
                      Show Report
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </section>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import JobStatusIcon from '@/components/JobStatusIcon.vue'

export default {
  name: 'WorkflowRuns',
  components: { JobStatusIcon },
  data() {
    return {
      workflowName: null,
      runs: null,
      loading: true,
      errored: false,
      polling: null,
      backend: process.env.VUE_APP_REST,
    }
  },
  methods: {
    poll() {
      this.polling = setInterval(() => this.fetchRuns(), 5000)
    },
    async fetchRuns() {
      const token = localStorage.getItem(
        `${process.env.VUE_APP_SPECKLE_APP_NAME}.AuthToken`
      )
      if (token && this.$store.getters.isAuthenticated) {
        // Get the name of the workflow
        axios
          .get(
            `${process.env.VUE_APP_REST}/workflows/${this.$route.params.workflowId}`,
            {
              params: { userId: this.$store.state.user.id },
              headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
              },
            }
          )
          .then((response) => {
            console.log('Fetched data from backend:', response.status)
            this.workflowName = response.data.name
          })
          .catch((error) => {
            console.log(error)
            this.errored = true
          })
        // Get the runs
        axios
          .get(
            `${process.env.VUE_APP_REST}/workflows/${this.$route.params.workflowId}/runs`,
            {
              params: { userId: this.$store.state.user.id },
              headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
              },
            }
          )
          .then((response) => {
            this.runs = response.data
          })
          .catch((error) => {
            console.log(error)
            this.errored = true
          })
          .finally(() => (this.loading = false))
      }
    },
  },
  created() {
    this.poll()
  },
  beforeDestroy() {
    clearInterval(this.polling)
  },
}
</script>

<style scoped></style>
