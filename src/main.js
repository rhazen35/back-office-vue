import Vue from "vue"
import App from "./App.vue"
import styles from "./assets/scss/app.scss"
import router from "./router"
import store from "./vuex/store"

import lodash from "lodash"

import vuetify from "./plugins/vuetify"
import helpers from "./plugins/helpers"

Vue.config.productionTip = false;

Vue.prototype._ = lodash

Vue.use(helpers)
Vue.use(lodash)

router.beforeEach((to, from, next) => {
    if (!localStorage.getItem("user") && to.name !== "login") {
        next("/login")
    }
    next()
})

new Vue({
    styles,
    router,
    store,
    vuetify,
    helpers,
    lodash,
    created() {
        this.$securityHelpers.automaticLogin()
        this.$securityHelpers.interceptUnAuthorized()
        this.$securityHelpers.isLoggedIn()
    },
    render: h => h(App)
}).$mount("#app")
