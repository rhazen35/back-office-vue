<template>
  <div class="dashboard">
    <v-container
    >
      <v-row>
        <v-col class="text-left">
          Welcome <span class="font-weight-black">{{ fullName }}</span>
        </v-col>
        <v-col
          v-if="lastLogin"
          class="text-right"
        >
          <span class="font-weight-black">Last login:</span> {{ lastLogin }}
        </v-col>
      </v-row>
    </v-container>
    <v-img
      :src="banner"
      aspect-ratio="3.5"
      cover
    />
  </div>
</template>

<script>
export default {
    name: "Dashboard",
    data() {
        return {
            banner: require("../../assets/img/planning-banner.jpeg")
        };
    },
    computed: {
        user() {
            return this.$store.auth.state.user
        },
        fullName() {
            let fullName = ""
            const user = localStorage.getItem("user")
            if (user) {
                const data = JSON.parse(user).data
                fullName = data.firstName + " " + data.lastName
            }

            return fullName
        },
        lastLogin() {
            let lastLogin = null
            const user = localStorage.getItem("user")

            if (user) {
                const data = JSON.parse(user).data
                return new Date(data.lastLogin.date).toLocaleString()
            }

            return false
        }
    }
};
</script>
