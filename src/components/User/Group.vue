<template>
  <div class="groups">
    <v-toolbar-title>
      <v-row>
        <v-col />
        <v-col class="d-flex justify-lg-end pt-2 orange lighten-4">
          <v-icon class="">
            mdi-security-network
          </v-icon>
        </v-col>
        <v-col class="d-flex justify-left orange lighten-5">
          Groups
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

    <v-text-field
      v-model="search"
      label="Search"
      @input="debounceSearch"
    />
    <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :server-items-length="totalItems"
      :items-per-page="rowsPerPage"
      class="elevation-2"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      show-expand
      :loading="loading"
      @update:page="updatePage"
    >
      <template v-slot:item.role="{ item }">
        <v-edit-dialog
          large
          persistent
          :return-value.sync="editedItem.role"
          @save="saveItem(item)"
          @open="editItem(item, true)"
        >
          {{ item.role }}
          <template v-slot:input>
            <v-text-field
              v-model="item.role"
              label="Edit"
              single-line
              counter
              autofocus
            />
          </template>
        </v-edit-dialog>
      </template>

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
                New Group
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
                        v-model="editedItem.role"
                        label="Name"
                        :error-messages="role.errors"
                        class="required"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                    >
                      <v-select
                        v-model="editedItem.childGroups"
                        :items="allGroups"
                        :error-messages="groups.errors"
                        item-text="role"
                        item-value="@id"
                        label="Groups"
                        multiple
                        chips
                        hint="Which sub group(s) this group has? (optional)"
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
                        item-text="role"
                        item-value="@id"
                        label="Roles"
                        :error-messages="securityRoles.errors"
                        multiple
                        chips
                        hint="Which roles(s) does this group have?"
                        persistent-hint
                        class="required"
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
                  @click="close()"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  :disabled="valid"
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
                  v-for="group in item.childGroups"
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
                  v-for="roleItem in item.securityRoles"
                  :key="roleItem.id"
                  dense
                >
                  {{ roleItem.role }}
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
        There are no groups available, please add one.
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
import _ from "lodash"
import snacks from "../Layout/SnackBar/snacks";

export default {
    name: "Role",
    data() {
        return {
            search: "",
            options: {},
            totalItems: 0,
            rowsPerPage: 10,
            loading: true,
            valid: false,
            dialog: false,
            snack: false,
            singleExpand: false,
            expanded: [],
            snackColor: '',
            snackText: '',
            groups: {
                errors: [],
            },
            securityRoles: {
                errors: [],
            },
            role: {
                errors: [],
            },
            headers: [
                { text: "#ID", value: "id" },
                { text: "Name", value: "role" },
                { text: "Actions", value: "action", sortable: false },
                { text: '', value: 'data-table-expand' },
            ],
            items: [],
            editedIndex: -1,
            editedItem: {
                role: "",
                childGroups: [],
                securityRoles: [],
            },
        };
    },
    computed: {
        isLoading() {
            return this.$store.getters["group/isLoading"]
        },
        hasError() {
            return this.$store.getters["group/hasError"]
        },
        error() {
            return this.$store.getters["group/error"]
        },
        allGroups() {
            return this.$store.getters["group/groups"]
        },
        roleItems() {
            return this.$store.getters["role/roles"]
        },
        hasGroups() {
            return this.$store.getters["group/hasRoles"]
        },
        formTitle() {
            return this.editedIndex === -1 ? "New Group" : "Edit Group"
        },
        params(nv) {
            return {
                ...this.options,
                query: this.search
            };
        }
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
        options: {
            handler () {
                this.getDataFromApi()
                    .then(data => {
                        this.setPagination(data)
                    })
            },
            deep: true
        }
    },
    mounted(event, callback) {
        this.getDataFromApi()
            .then(data => {
                this.setPagination(data)
            })
    },
    methods: {
        debounceSearch: _.debounce(function(value) {
            this.search = value
            const response = this.getDataFromApi()
            response.then(data => {
                this.setPagination(data)
            })
        }, 200),
        setPagination(data) {
            this.items = data.items
            this.totalItems = data.total
            this.rowsPerPage = data.itemsPerPage
        },
        updatePage() {
            this.$emit('update:options', this.getDataFromApi())
        },
        async paginate(data) {
            return await this.$store.dispatch('group/paginate', data)
        },
        getDataFromApi() {
            this.loading = true
            return new Promise((resolve, reject) => {
                let { sortBy, sortDesc, page, itemsPerPage } = this.options
                let search = this.search.trim().toLowerCase();
                let sortOrder = sortDesc.length === 1 ? "desc" : "asc"

                if (itemsPerPage === -1) {
                    itemsPerPage = 50;
                }

                if (search) {
                    this.options.page = 1
                }

                let data = {
                    page: page,
                    itemsPerPage: itemsPerPage,
                    role: search,
                    id: search
                }

                if (sortBy.length > 0) {
                    data['order[' + sortBy + ']'] = sortOrder
                }

                const response = this.paginate(data)
                response.then(data => {

                    let items = data['hydra:member']
                    const total = data['hydra:totalItems']
                    const itemsPerPage = items.length

                    setTimeout(() => {
                        this.loading = false
                        resolve({
                            items,
                            total,
                            itemsPerPage
                        })
                    }, 1000)
                });
            })
        },
        initialize() {
            const response = this.getDataFromApi()
            response.then(data => {
                this.setPagination(data)
            })
        },
        save() {

            this.resetViolations()

            const element = this.convertToUris(this.editedItem)
            const response = this.editedIndex > -1 ? this.editRole(element) : this.createRole(element)

            response.then(data => {
                if (!this.hasViolations(data)) {
                    this.initialize()
                    this.close()
                    this.savedSnack()
                }
            })
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
        editItem(item, inline = false) {
            this.resetViolations()
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)

            if (!inline) {
                this.dialog = true
            }
        },
        convertToUris(element) {
            let groupUris = [];
            if (element.childGroups) {
                for (let i = 0; i < element.childGroups.length; i++) {
                    groupUris.push(element.childGroups[i]['@id'])
                }
                element.childGroups = groupUris
            }
  
            let roleUris = [];
            if (element.securityRoles) {
                for (let i = 0; i < element.securityRoles.length; i++) {
                    if (element.securityRoles[i]['@id']) {
                        roleUris.push(element.securityRoles[i]['@id'])
                    }

                    if (element.securityRoles[i]) {
                        roleUris.push(element.securityRoles[i])
                    }
                }
                element.securityRoles = roleUris
            }
  
            return element
        },
        resetViolations() {
            this.groups.errors = []
            this.securityRoles.errors = []
            this.role.errors = []
        },
        deleteItem(item) {
            const index = this.items.indexOf(item);
            confirm("Are you sure you want to delete this item?") &&
                this.items.splice(index, 1) &&
                this.deleteRole(item.id)
        },
        async createRole(element) {
            return await this.$store.dispatch("group/create", element)
        },
        async editRole(element) {
            return this.$store.dispatch("group/update", element)
        },
        async deleteRole(id) {
            await this.$store.dispatch("group/delete", id)
            this.initialize()
            this.deletedSnack()
        },
        close() {
            this.dialog = false
            this.resetViolations()
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300)
        },
        saveItem(item) {
            this.editedItem.role = item.role
            this.save()
        },
        ...snacks
    },
    deleted() {
        this.$store.dispatch("group/findAll")
    }
};
</script>
