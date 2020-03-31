<template>
  <div class="groups">
    <v-toolbar-title>
      <v-row>
        <v-col />
        <v-col class="d-flex justify-lg-end pt-2 orange lighten-3">
          <v-icon class="">
            mdi-security
          </v-icon>
        </v-col>
        <v-col class="d-flex justify-left orange lighten-5">
          Roles
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
          <v-chip
            :color="getColor(item.role)"
            label
          >
            {{ item.role }}
          </v-chip>
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
          <v-row
            class="mb-1"
            no-gutters
          >
            <v-col class="pa-1 green lighten-4">
              Create
            </v-col>
            <v-col class="pa-1 blue lighten-4">
              Read
            </v-col>
            <v-col class="pa-1 orange lighten-4">
              Update
            </v-col>
            <v-col class="pa-1 red lighten-4">
              Delete
            </v-col>
          </v-row>
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
                New Role
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
                        label="Role"
                        :error-messages="role.errors"
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
        There are no roles available, please add one.
      </template>
    </v-data-table>

    <v-snackbar
      v-model="snack"
      :timeout="5000"
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
            snackColor: '',
            snackText: '',
            role: {
                errors: []
            },
            headers: [
                { text: "#ID", value: "id" },
                { text: "Role", value: "role" },
                { text: "Actions", value: "action", sortable: false }
            ],
            items: [],
            editedIndex: -1,
            editedItem: {
                role: ""
            },
            defaultItem: {
                role: ""
            }
        };
    },
    computed: {
        isLoading() {
            return this.$store.getters["role/isLoading"]
        },
        hasError() {
            return this.$store.getters["role/hasError"]
        },
        error() {
            return this.$store.getters["role/error"]
        },
        hasRoles() {
            return this.$store.getters["role/hasRoles"]
        },
        formTitle() {
            return this.editedIndex === -1 ? "New Role" : "Edit Role"
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
            return await this.$store.dispatch('role/paginate', data)
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

            this.role.errors = []

            const response = this.editedIndex > -1 ? this.editRole(this.editedItem) : this.createRole()

            response.then(data => {
                if (!this.hasViolations(data)) {
                    const snackMessage = this.editedItem.role + " has been saved."
                    this.role.errors = []
                    this.initialize()
                    this.close()
                    this.savedSnack(snackMessage)
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
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)

            if (!inline) {
                this.dialog = true
            }
        },
        deleteItem(item) {
            const index = this.items.indexOf(item);
            confirm("Are you sure you want to delete this item?") &&
                this.items.splice(index, 1) &&
                this.deleteRole(item.id)
        },
        async createRole() {
            return await this.$store.dispatch("role/create", this.$data.editedItem)
        },
        async editRole(item) {
            return this.$store.dispatch("role/update", item)
        },
        async deleteRole(id) {
            await this.$store.dispatch("role/delete", id)
            this.initialize()
            this.deletedSnack()
        },
        close() {
            this.dialog = false
            this.role.errors = []
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300)
        },
        getColor (role) {
            const parts = role.split("_");
            const crudMethodName = parts[2];

            if (crudMethodName) {
                switch (crudMethodName) {
                case 'CREATE':
                    return 'green lighten-4'
                case 'READ':
                    return 'blue lighten-4'
                case 'UPDATE':
                    return 'orange lighten-4'
                case 'DELETE':
                    return 'red lighten-4'
                }
            }
        },
        saveItem(item) {
            this.editedItem.role = item.role
            this.save()
        },
        ...snacks
    },
    deleted() {
        this.$store.dispatch("role/findAll")
    }
};
</script>
