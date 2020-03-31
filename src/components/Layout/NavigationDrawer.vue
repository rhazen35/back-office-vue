<template>
  <v-navigation-drawer
    v-model="drawer"
    width="300px"
    app
  >
    <v-list
      nav
      dense
    >
      <template>
        <v-list-item>
          <v-img
            :src="logo"
            class="ma-5"
            aspect-ratio="3"
            contain
          />
        </v-list-item>
        <v-divider />
        <div
          v-for="link in links"
          :key="link.title"
        >
          <v-list-group
            v-show="isGranted(link)"
            v-if="link.items"
            :key="link.title"
            v-model="link.active"
            :prepend-icon="link.action"
            no-action
            link
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title
                  class="text-left"
                  v-text="link.title"
                />
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="item in link.items"
              v-show="isGranted(item)"
              :key="item.title"
              :to="{ name: item.to }"
              active-class="white--text orange darken-2 text-left"
            >
              <div
                v-if="isGranted(item)"
                class="d-flex"
              >
                <v-list-item-icon>
                  <v-icon>{{ item.action }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    class="text-left"
                    v-text="item.title"
                  />
                </v-list-item-content>
              </div>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :to="{ name: link.to }"
            active-class="white--text orange darken-2"
          >
            <v-list-item-icon>
              <v-icon>{{ link.action }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                class="text-left"
                v-text="link.title"
              />
            </v-list-item-content>
          </v-list-item>
        </div>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
    name: "NavigationDrawer",
    data() {
        return {
            drawer: true,
            group: "",
            logo: require("../../assets/img/logo/skeme-logo.svg"),
            links: [
                {
                    action: "mdi-view-dashboard",
                    title: "Dashboard",
                    to: "dashboard"
                },
                {
                    action: "mdi-account-box-multiple",
                    title: "Users Management",
                    items: [
                        {
                            action: "mdi-account-group",
                            title: "Users",
                            to: "users"
                        },
                        {
                            action: "mdi-security-network",
                            title: "Groups",
                            to: "user-groups"
                        },
                        {
                            action: "mdi-security",
                            title: "Roles",
                            to: "user-roles"
                        }
                    ]
                },
            ]
        };
    },
    created() {
        const currentRoute = this.$router.currentRoute;
        for (let i = 0; i < this.links.length; i++) {
            if (this.links[i].items) {
                for (let j = 0; j < this.links[i].items.length; j++) {
                    if (this.links[i].items[j].to === currentRoute.name) {
                        this.links[i].active = true;
                        this.links[i].items[j].active = true;
                    }
                }
            }
        }
    },
    methods: {
        isGranted(item) {
            const userString = localStorage.getItem('user')
            if (userString) {
                const user = JSON.parse(userString)
                if (user.data.roles) {
                    const roles = user.data.roles;

                    if (item.to === "user-groups") {
                        return roles.includes('ROLE_SUPER_ADMIN');
                    }

                    if (item.title && item.title === "Users Management") {
                        return roles.includes('ROLE_ADMIN');
                    }

                    if (item.to === "user-roles") {
                        return roles.includes('ROLE_SUPER_ADMIN');
                    }
                }
            }

            return true;
        }
    }
};
</script>
