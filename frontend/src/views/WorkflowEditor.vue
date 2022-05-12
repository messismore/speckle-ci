<template>
  <v-container class="workflow-editor fill-height py-5">
    <v-progress-linear
      v-if="loading"
      class="toploader"
      indeterminate
      color="accent"
    />
    <v-row justify="center">
      <v-col sm="10" md="8">
        <v-form v-model="valid">
          <v-row>
            <v-col
              class="d-flex flex-row-reverse flex-wrap flex-sm-nowrap pb-0"
            >
              <div class="cancel-undo-save mt-5 flex-grow-1 d-flex flex-nowrap">
                <div class="mr-3 d-flex flex-nowrap">
                  <v-tooltip top color="black">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        large
                        color="error"
                        v-bind="attrs"
                        v-on="on"
                        :to="'/'"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </template>
                    <span>Cancel</span>
                  </v-tooltip>
                  <v-tooltip top color="black">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon large color="info" v-bind="attrs" v-on="on">
                        <v-icon>mdi-undo</v-icon>
                      </v-btn>
                    </template>
                    <span>Undo</span>
                  </v-tooltip>
                </div>
                <v-spacer />
                <v-tooltip color="black" :disabled="canBeSaved">
                  <template v-slot:activator="{ on, attrs }">
                    <span v-on="on">
                      <v-btn
                        depressed
                        color="primary"
                        :disabled="!canBeSaved"
                        v-bind="attrs"
                        @click="saveWorkflow"
                      >
                        Save
                      </v-btn>
                    </span>
                  </template>
                  <span>{{ this.missingFields }}</span>
                </v-tooltip>
              </div>
              <v-text-field
                class="name flex-grow-1"
                v-model="workflow.name"
                :rules="nameRules"
                required
                label="Name"
                placeholder="New Workflow"
                persistent-placeholder
                single-line
                hint="Give your workflow a memorable name"
                tabindex="1"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <section class="stream mb-3">
                <v-autocomplete
                  v-model="workflow.streamId"
                  :items="
                    streams.map((stream) => {
                      return { text: stream.name, value: stream.id }
                    })
                  "
                  label="Choose which stream this workflow belongs to"
                  solo
                  tabindex="2"
                >
                </v-autocomplete>
              </section>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <section class="triggers mb-3">
                <h3 class="text-h6">Triggers</h3>
                <v-combobox
                  v-model="workflow.triggers"
                  :items="validTriggers"
                  label="These events will trigger this workflow"
                  multiple
                  chips
                  tabindex="2"
                  deletable-chips
                >
                </v-combobox>
              </section>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <section class="conditions mb-3">
                <h3 class="text-h6">Conditions</h3>
                <v-combobox
                  v-model="workflow.conditions"
                  :items="filters"
                  label="Restrict trigger to these branches or apps"
                  multiple
                  chips
                  tabindex="3"
                  deletable-chips
                >
                </v-combobox>
              </section>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <section class="actions">
                <h3 class="text-h6">Actions</h3>

                <v-card
                  v-for="(action, i) in workflow.recipe"
                  :key="i"
                  elevation="5"
                  rounded="lg"
                  class="mx-5 my-8"
                >
                  <v-card-title class="text-subtitle-1 font-weight-regular">
                    {{ action.name }} <v-spacer />
                    <v-btn icon @click="removeAction(i)">
                      <v-icon> mdi-close-circle </v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-text v-for="(option, i) in action.options" :key="i">
                    <!--  Hacky for now -->
                    <v-select
                      v-if="option.type === 'SELECT'"
                      v-model="option.value"
                      dense
                      filled
                      outlined
                      :label="option.label"
                      :items="
                        // Spitballing, should probably go with passing actual variables that hold a function or expression, $vars are ugly
                        typeof option.choices == 'string' &&
                        option.choices[0] === '$' &&
                        ['$streams'].includes(option.choices)
                          ? optionVars[option.choices]
                          : option.choices
                      "
                      :default="option.default"
                    />
                    <v-text-field
                      v-if="option.type === 'TEXT'"
                      v-model="option.value"
                      dense
                      filled
                      outlined
                      :label="option.label"
                      :default="option.default"
                    />
                    <v-textarea
                      v-if="option.type === 'MULTILINE'"
                      v-model="option.value"
                      dense
                      filled
                      outlined
                      :label="option.label"
                      :default="option.default"
                    />
                  </v-card-text>
                </v-card>

                <v-dialog v-model="actionStore" width="700px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      x-large
                      block
                      rounded
                      depressed
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                      tabindex="4"
                      class="mt-10"
                    >
                      <v-icon left>mdi-plus</v-icon>Add Action
                    </v-btn>
                  </template>
                  <ActionStore
                    :recipe="workflow.recipe"
                    @choseAction="actionStore = false"
                  />
                </v-dialog>
              </section>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

import { listAllStreams } from '@/speckleUtils'
import ActionStore from '@/components/ActionStore.vue'

export default {
  name: 'WorkflowEditor',
  components: { ActionStore },
  props: {
    workflowId: null,
  },
  data() {
    return {
      loading: true,
      errored: false,
      workflow: {
        name: null,
        streamId: null,
        triggers: [],
        conditions: { apps: [], branches: [] },
        recipe: [],
      },

      actionStore: false,
      valid: true,
      nameRules: [
        (v) => !!v || 'Required',
        (v) => (v ?? []).length > 3 || 'Name must be more than 3 characters',
        (v) => (v ?? []).length < 50 || 'Name must be less than 50 characters',
      ],
      streams: [],
      validTriggers: [
        'branch_create',
        'branch_delete',
        'branch_update',
        'commit_create',
        'commit_delete',
        'commit_update',
        'stream_delete',
        'stream_update',
        'commit_receive',
        'stream_permissions_add',
        'stream_permissions_remove',
      ],
      filters: [
        'These',
        'Are',
        'Hardcoded',
        'And',
        "Won't",
        'Work',
        'Rhino 3D',
        'Grasshopper',
        'Revit',
      ],
    }
  },
  computed: {
    canBeSaved: {
      get() {
        return (
          !!this.workflow.name &&
          !!this.workflow.streamId &&
          !!this.workflow.triggers[0] &&
          !!this.workflow.recipe[0]
        )
      },
    },
    missingFields: {
      get() {
        const mask = [
          !this.workflow.name,
          !this.workflow.streamId,
          !this.workflow.triggers[0],
          !this.workflow.recipe[0],
        ]
        const fields = ['a name', 'a stream', 'a trigger', 'an action'].filter(
          (field, i) => mask[i]
        )

        const formattedFields = [
          fields.slice(0, -1).join(', '),
          fields.slice(-1),
        ].join(fields.length < 2 ? '' : fields.length == 2 ? ' and ' : ', and ')
        return `Your workflow still needs
        ${formattedFields}`
      },
    },
    optionVars: {
      get() {
        return {
          $streams: this.streams.map((stream) => {
            return { text: stream.name, value: stream.id }
          }),
        }
      },
    },
  },
  async mounted() {
    // Wait for everything to load
    await Promise.all([
      (async () => {
        this.streams = await listAllStreams()
      })(),
      (async () => {
        if (this.workflowId) this.fetchWorkflow()
      })(),
      this.$store.dispatch('getActions'),
    ])

    this.loading = false
  },
  methods: {
    async fetchWorkflow() {
      const token = localStorage.getItem(
        `${process.env.VUE_APP_SPECKLE_APP_NAME}.AuthToken`
      )
      if (token && this.$store.getters.isAuthenticated) {
        // Get the name of the workflow
        axios
          .get(`${process.env.VUE_APP_REST}/workflows/${this.workflowId}`, {
            headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {
            this.workflow = this.decompileWorkflow(response.data)
          })
          .catch((error) => {
            console.log(error)
            this.errored = true
          })
      }
    },
    removeAction(i) {
      this.workflow.recipe.splice(i, 1)
    },
    compileWorkflow() {
      return {
        ...this.workflow,
        recipe: this.workflow.recipe.map((step, i, recipe) => ({
          action: step.action,
          instanceId: step.instanceId,
          options: step.options
            .map((option) =>
              !option.type && !option.value && recipe[i - 1]
                ? {
                    value: `\${results.${recipe[i - 1].instanceId}.${
                      recipe[i - 1].outputs[0].name
                    }}`,
                    ...option,
                  }
                : option
            )
            .reduce(
              (previous, current) => ({
                [current.id]: current.value,
                ...previous,
              }),
              {}
            ),
        })),
      }
    },
    decompileWorkflow(workflow) {
      workflow.recipe = workflow.recipe.map((step) => {
        const action = this.$store.state.actions
          .filter((action) => action.action === step.action)
          .pop()
        return {
          ...action,
          options: action.options.map((option) => ({
            ...option,
            value: step.options[option.id],
          })),
        }
      })
      return workflow
    },
    async saveWorkflow() {
      // Make a request to our backend
      const token = localStorage.getItem(
        `${process.env.VUE_APP_SPECKLE_APP_NAME}.AuthToken`
      )
      if (token && this.$store.getters.isAuthenticated) {
        axios({
          url: `/workflows/${this.workflowId ?? ''}`,
          baseURL: process.env.VUE_APP_REST,
          method: this.workflowId ? 'patch' : 'post',
          data: this.compileWorkflow(),

          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            console.log(response)
            if (response.status == 200)
              this.$router.push('/').catch((error) => {
                console.log(error)
              })
          })
          .catch((error) => {
            console.log(error)
            this.errored = true
          })
      }
    },
  },
}
</script>

<style>
.workflow-editor .toploader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 6; /* v-app-bar is 5 */
}
.workflow-editor .name {
  width: 100%;
}

.workflow-editor .name div.v-text-field__slot input {
  font-size: 2.125rem;
  padding-bottom: 0.5rem;
  min-height: 48px;
}
.workflow-editor .name input::placeholder {
  color: rgba(0, 0, 0, 0.87) !important;
  opacity: 1;
}
.workflow-editor .name input:focus::placeholder {
  color: black !important;
  opacity: 0;
}
</style>
