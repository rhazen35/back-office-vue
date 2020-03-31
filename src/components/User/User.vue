<template>
  <div class="users">
    <v-toolbar-title>
      <v-row>
        <v-col />
        <v-col class="d-flex justify-lg-end pt-2 orange lighten-3">
          <v-icon class="">
            mdi-account-group
          </v-icon>
        </v-col>
        <v-col class="d-flex justify-left orange lighten-5">
          Users
        </v-col>
        <v-col />
      </v-row>
    </v-toolbar-title>

    <v-divider
      inset
      vertical
    />
    <v-divider
      inset
      vertical
    />

    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="10"
      class="elevation-1"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      :loading="loading"
      show-expand
    >
      <template v-slot:top>
        <v-toolbar
          flat
          color="white"
        >
          <v-spacer />
          <v-dialog
            v-model="dialog"
            max-width="800px"
          >
            <template v-slot:activator="{ on }">
              <v-btn
                color="orange darken-2"
                dark
                class="mb-2"
                v-on="on"
              >
                New User
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                    >
                      <v-text-field
                        v-model="editedItem.firstName"
                        label="First name"
                        :error-messages="firstName.errors"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                    >
                      <v-text-field
                        v-model="editedItem.lastName"
                        label="Last name"
                        :error-messages="lastName.errors"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                    >
                      <v-text-field
                        v-model="editedItem.email"
                        label="Email"
                        :error-messages="email.errors"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-if="editedIndex === -1"
                        v-model="editedItem.plainPassword"
                        label="Password"
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPassword ? 'text' : 'password'"
                        name="input-10-2"
                        hint="At least 8 characters"
                        class="input-group--focused"
                        :error-messages="plainPassword.errors"
                        @click:append="showPassword = !showPassword"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                    >
                      <v-select
                        v-model="editedItem.groups"
                        :items="groupItems"
                        :error-messages="groups.errors"
                        item-text="role"
                        item-value="@id"
                        label="Groups"
                        multiple
                        chips
                        hint="Which group(s) is this user in?"
                        persistent-hint
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                    >
                      <v-select
                        v-model="editedItem.securityRoles"
                        :items="roleItems"
                        :error-messages="securityRoles.errors"
                        item-text="role"
                        item-value="@id"
                        label="Roles"
                        multiple
                        chips
                        hint="Which roles(s) does this user have?"
                        persistent-hint
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:expanded-item="{ item }">
        <td :colspan="headers.length">
          <v-container>
            <v-row>
              <v-col class="blue lighten-4">
                <v-subheader
                  class="font-weight-black"
                >
                  Groups
                </v-subheader>
                <v-list-item
                  v-for="group in item.groups"
                  :key="group.id"
                  dense
                >
                  {{ group.role }}
                </v-list-item>
              </v-col>
              <v-col class="blue lighten-5">
                <v-subheader
                  class="font-weight-black"
                >
                  Roles
                </v-subheader>
                <v-list-item
                  v-for="role in item.securityRoles"
                  :key="role.id"
                  dense
                >
                  {{ role.role }}
                </v-list-item>
              </v-col>
            </v-row>
          </v-container>
        </td>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        There are no users available, please add one.
      </template>
    </v-data-table>
    <v-snackbar
      v-model="snack"
      :timeout="3000"
      :color="snackColor"
    >
      {{ snackText }}
      <v-btn
        text
        @click="snack = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import snacks from "../Layout/SnackBar/snacks";

export default {
    name: "User",
    data() {
        return {
            snack: false,
            snackColor: "",
            snackText: "",
            expanded: [],
            singleExpand: false,
            valid: false,
            dialog: false,
            loading: true,
            showPassword: false,
            headers: [
                { text: "#ID", value: "id" },
                { text: "First name", value: "firstName" },
                { text: "Last name", value: "lastName" },
                { text: "Email", value: "email" },
                { text: "Username", value: "username" },
                { text: "Actions", value: "action", sortable: false },
                { text: '', value: 'data-table-expand' },
            ],
            items: [],
            editedIndex: -1,
            editedItem: {
                firstName: "",
                lastName: "",
                email: "",
                plainPassword: "",
                groups: [],
                securityRoles: []
            },
            groups: {
                errors: []
            } ,
            securityRoles: {
                errors: []
            },
            firstName: {
                errors: []
            },
            lastName: {
                errors: []
            },
            email: {
                errors: []
            },
            plainPassword: {
                errors: []
            }
        };
    },
    computed: {
        isLoading() {
            return this.$store.getters["user/isLoading"]
        },
        hasError() {
            return this.$store.getters["user/hasError"]
        },
        error() {
            return this.$store.getters["user/error"]
        },
        hasUsers() {
            return this.$store.getters["user/hasUsers"]
        },
        groupItems() {
            return this.$store.getters["group/groups"]
        },
        roleItems() {
            return this.$store.getters["role/roles"]
        },
        formTitle() {
            return this.$data.editedIndex === -1 ? "New User" : "Edit User"
        }
    },
    watch: {
        dialog(val) {
            val || this.close()
        }
    },
    created() {
        this.initialize()
    },
    methods: {
        async initialize() {
            this.loading = true
            const response = await this.$store.dispatch("user/findAll")
            this.items = response["hydra:member"]
            this.loading = false
        },
        editItem(item) {
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem(item) {
            const index = this.items.indexOf(item)
            confirm("Are you sure you want to delete this item?") &&
            this.items.splice(index, 1) &&
            this.deleteUser(item.id)
        },
        async createUser(element) {
            return await this.$store.dispatch("user/create", element)
        },
        async editUser(element) {
            return await this.$store.dispatch("user/update", element)
        },
        async deleteUser(id) {
            await this.$store.dispatch("user/delete", id)
            this.initialize()
        },
        save() {

            this.resetViolations()
          
            const element = this.convertToUris(this.editedItem)
            const response = this.editedIndex > -1 ? this.editUser(element) : this.createUser(element)

            response.then(data => {
                if (!this.hasViolations(data)) {
                    this.initialize()
                    this.close()
                    this.savedSnack()
                }
            })
        },
        convertToUris(element) {
            let groupUris = [];
            if (element.groups) {
                for (let i = 0; i < element.groups.length; i++) {
                    if (element.groups[i]['@id']) {
                        groupUris.push(element.groups[i]['@id'])
                    }

                    if (!element.groups[i]['@id'] && element.groups[i]) {
                        groupUris.push(element.groups[i])
                    }
                }
                element.groups = groupUris
            }

            let roleUris = [];
            if (element.securityRoles) {
                for (let i = 0; i < element.securityRoles.length; i++) {
                    if (element.securityRoles[i]['@id']) {
                        roleUris.push(element.securityRoles[i]['@id'])
                    }
                }
                element.securityRoles = roleUris
            }

            return element
        },
        close() {
            this.resetViolations()
            this.dialog = false
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300);
        },
        hasViolations(data) {
            if (data && data.hasOwnProperty('violations')) {
                data.violations.forEach((violation) => {
                    if (violation.hasOwnProperty('propertyPath') && violation.hasOwnProperty('message')) {
                        this[violation.propertyPath].errors.push(violation.message)
                    }
                })
                this.violationSnack()
                return true
            }
            return false
        },
        resetViolations() {
            this.groups.errors = []
            this.securityRoles.errors = []
            this.firstName.errors = []
            this.lastName.errors = []
            this.email.errors = []
            this.plainPassword.errors = []
        },
        ...snacks
    },
    deleted() {
        this.$store.dispatch("user/findAll")
    }
};
</script>
