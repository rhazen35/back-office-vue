<template>
  <v-app-bar
    app
    color="orange darken-2"
    dark
  >
    <v-app-bar-nav-icon @click.stop="$emit('toggle-drawer')" />
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer />
    <v-menu
      offset-y
      transition="slide-x-reverse-transition"
      left
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
        >
          <v-icon dark>
            mdi-account
          </v-icon>
        </v-btn>
      </template>
      <v-list
        dense
        class="mt-2 float-right"
      >
        <v-list-item>
          <v-btn @click="$vuetify.theme.dark=!$vuetify.theme.dark">
            {{ $vuetify.theme.isDark ? 'Light Mode' : 'Dark Mode' }}
          </v-btn>
        </v-list-item>
        <v-list-item @click="logout">
          <v-icon class="pr-4">
            mdi-logout-variant
          </v-icon>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
    name: "ApplicationBar",
    data() {
        return {
            title: "Skeme Planning Back Office System",
            items: [{ action: "mdi-logout-variant", title: "Logout", to: "logout" }],
        };
    },
    methods: {
        logout() {
            this.$store.dispatch("auth/logout");
        },
    }
};
</script>
