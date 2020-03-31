<template>
  <v-app>
    <transition name="fade">
      <NavigationDrawer
        v-if="isLoggedIn"
        ref="drawer"
      />
    </transition>
    <transition name="fade">
      <ApplicationBar
        v-if="isLoggedIn"
        @toggle-drawer="$refs.drawer.drawer = !$refs.drawer.drawer"
      />
    </transition>

    <v-content>
      <v-container>
        <transition name="fade">
          <router-view />
        </transition>
      </v-container>
    </v-content>

    <v-footer app>
      &copy; {{ copyrightYear }} Skeme Planning Software
    </v-footer>
  </v-app>
</template>

<script>
import NavigationDrawer from "./components/Layout/NavigationDrawer";
import ApplicationBar from "./components/Layout/ApplicationBar";

export default {
    name: "App",
    components: { NavigationDrawer, ApplicationBar },
    data() {
        return {
            drawer: true,
            copyrightYear: new Date().getFullYear()
        }
    },
    computed: {
        isLoggedIn() {
            return this.$store.getters["auth/isLoggedIn"]
        }
    },
}
</script>
