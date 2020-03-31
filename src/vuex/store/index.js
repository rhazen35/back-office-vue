import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import Auth from "./auth/auth";

import User from "./user/user";
import Group from "./user/group";
import Role from "./user/role";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user: User,
        group: Group,
        role: Role,
        auth: Auth
    },
    plugins: [createPersistedState()]
});
