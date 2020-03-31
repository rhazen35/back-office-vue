<template>
  <div
    class="login"
  >
    <v-toolbar-title>
      <v-img
        :src="logo"
        aspect-ratio="10.0"
        class="mt-12"
        contain
      />
    </v-toolbar-title>
    <v-divider
      inset
      vertical
    />
    <v-divider
      inset
      vertical
    />

    <ValidationObserver
      ref="form"
      v-slot="{ passes }"
    >
      <form
        class="login-form"
        @submit.prevent="passes(submit)"
      >
        <span :class="valid">{{ message }}</span>
        <ValidationProvider
          v-slot="{}"
          vid="email"
          name="Email"
        >
          <v-text-field
            v-model="email"
            :counter="100"
            label="E-mail"
            required
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{}"
          vid="password"
          name="Password"
        >
          <v-text-field
            v-model="password"
            label="Password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            name="input-10-2"
            hint="At least 8 characters"
            class="input-group--focused"
            required
            @click:append="showPassword = !showPassword"
          />
        </ValidationProvider>

        <v-btn
          class="mr-4 orange darken-2 white--text"
          @click="submit"
        >
          Login
        </v-btn>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
    name: "LoginUser",
    components: {
        ValidationObserver,
        ValidationProvider
    },
    data() {
        return {
            email: "",
            password: "",
            showPassword: false,
            valid: "black--text",
            message: "Please enter your credentials below.",
            logo: require("../../assets/img/logo/skeme-logo.svg")
        };
    },
    computed: {
        hasError() {
            return this.$store.getters["auth/hasError"];
        },
        error() {
            return this.$store.getters["auth/error"];
        }
    },
    methods: {
        async submit() {
            const response = await this.$store.dispatch("auth/login", this.$data);
            if (!response) {
                this.valid = "red--text";
                this.message = "Invalid login, please try again.";
                return;
            }

            await this.$router.push({ name: "dashboard" });
        }
    }
};
</script>
