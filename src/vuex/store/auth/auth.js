import AuthAPI from "../../api/auth/auth";
import axios from "axios";

const LOGIN_USER = "LOGIN_USER",
    LOGIN_USER_SUCCESS = "LOGIN_USER_SUCCESS",
    LOGIN_USER_ERROR = "LOGIN_USER_ERROR",
    LOGOUT_USER = "LOGOUT_USER",
    SET_USER_DATA = "SET_USER_DATA";

export default {
    namespaced: true,
    state: {
        isLoading: false,
        error: null,
        user: null
    },
    getters: {
        isLoggedIn(state) {
            return !!state.user;
        }
    },
    mutations: {
        [SET_USER_DATA](state, data) {
            state.isLoading = false;
            state.error = null;
            state.user = data;
            localStorage.setItem("user", JSON.stringify(data));
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        },
        [LOGIN_USER](state) {
            state.isLoading = true;
            state.error = null;
        },
        [LOGIN_USER_SUCCESS](state) {
            state.isLoading = false;
            state.error = null;
        },
        [LOGIN_USER_ERROR](state, error) {
            state.isLoading = false;
            state.error = error;
        },
        [LOGOUT_USER](state, data) {
            state.user = null;
            localStorage.removeItem("user");
            location.reload();
        }
    },
    actions: {
        async login({ commit }, data) {
            commit(LOGIN_USER);
            try {
                let response = await AuthAPI.login(data);
                commit(LOGIN_USER_SUCCESS);
                commit(SET_USER_DATA, response.data);
                return response.data;
            } catch (error) {
                commit(LOGIN_USER_ERROR, error);
                return null;
            }
        },
        async logout({ commit }, data) {
            commit(LOGOUT_USER, data);
        },
        async setUserData({ commit }, data) {
            await commit(SET_USER_DATA, data);
        }
    }
};
