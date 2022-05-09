<template>
  <v-card class="rounded-lg pb-2" elevation="4">
    <v-row class="px-4 pb-2">
      <v-card-title>Configured Workflows</v-card-title>
      <v-spacer />
      <v-card-actions>
        <v-btn to="/new" depressed color="primary"> Create new workflow </v-btn>
      </v-card-actions>
    </v-row>
    <v-divider />

    <section v-if="errored">
      <p>Couldn't load workflows. Please try to refresh the page.</p>
    </section>
    <section v-else>
      <div v-if="loading">
        <v-progress-linear indeterminate color="accent" />
      </div>

      <v-list flat>
        <v-list-item-group
          v-for="(workflow, i) in workflows"
          :key="i /* sort by lastRun > name > i */"
        >
          <v-list-item :to="workflow._id">
            <JobStatusIcon
              :status="
                workflow.lastRun
                  ? workflow.lastRun.status
                  : undefined /* no optional chaining in Vue2 */
              "
            />

            <v-list-item-content>
              <v-list-item-title v-text="workflow.name" />
            </v-list-item-content>

            <v-list-item-content>
              <v-list-item-subtitle>
                {{
                  !workflow.lastRun
                    ? 'Never run'
                    : !workflow.lastRun.finishedAt
                    ? 'In Progress'
                    : workflow.lastRun.finishedAt
                        .slice(0, 16)
                        .replaceAll('T', ' ')
                        .replaceAll('-', '.')
                }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn small depressed outlined :to="`${workflow._id}/edit`">
                Edit
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </section>
  </v-card>
</template>

<script>
import axios from 'axios'
import JobStatusIcon from '@/components/JobStatusIcon.vue'

export default {
  name: 'WorkflowList',
  components: { JobStatusIcon },

  data() {
    return {
      workflows: null,
      loading: true,
      errored: false,
    }
  },
  async mounted() {
    this.getWorkflows()
  },
  methods: {
    async getWorkflows() {
      const token = localStorage.getItem(
        `${process.env.VUE_APP_SPECKLE_APP_NAME}.AuthToken`
      )
      if (token && this.$store.getters.isAuthenticated) {
        axios
          .get(`${process.env.VUE_APP_REST}/workflows`, {
            params: { userId: this.$store.state.user.id },
            headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {
            this.workflows = response.data.sort(
              (a, b) =>
                (b.lastRun?.createdAt ?? -1) - (a.lastRun?.createdAt ?? -1)
            )
          })
          .catch((error) => {
            console.log(error)
            this.errored = true
          })
          .finally(() => (this.loading = false))
      }
    },
  },
}
</script>

<style scoped></style>
