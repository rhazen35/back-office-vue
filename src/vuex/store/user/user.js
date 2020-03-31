import UserAPI from "../../api/user/user";

const CREATING_USER = "CREATING_USER",
    CREATING_USER_SUCCESS = "CREATING_USER_SUCCESS",
    CREATING_USER_ERROR = "CREATING_USER_ERROR",
    UPDATING_USER = "UPDATING_USER",
    UPDATING_USER_SUCCESS = "UPDATING_USER_SUCCESS",
    UPDATING_USER_ERROR = "UPDATING_USER_ERROR",
    DELETING_USER = "DELETING_USER",
    DELETING_USER_SUCCESS = "DELETING_USER_SUCCESS",
    DELETING_USER_ERROR = "DELETING_USER_ERROR",
    FETCHING_USERS = "FETCHING_USERS",
    FETCHING_USERS_SUCCESS = "FETCHING_USERS_SUCCESS",
    FETCHING_USERS_ERROR = "FETCHING_USERS_ERROR";

export default {
    namespaced: true,
    state: {
        isLoading: false,
        error: null,
        users: []
    },
    getters: {
        isLoading(state) {
            return state.isLoading;
        },
        hasError(state) {
            return state.error !== null;
        },
        error(state) {
            return state.error;
        },
        hasUsers(state) {
            return state.users["hydra:member"].length > 0;
        },
        users(state) {
            return state.users["hydra:member"];
        }
    },
    mutations: {
        [CREATING_USER](state) {
            state.isLoading = true;
            state.error = null;
        },
        [CREATING_USER_SUCCESS](state, user) {
            state.isLoading = false;
            state.error = null;
            state.users["hydra:member"].unshift(user);
        },
        [CREATING_USER_ERROR](state, error) {
            state.isLoading = false;
            state.error = error;
            state.users = [];
        },
        [UPDATING_USER](state) {
            state.isLoading = true;
            state.error = null;
        },
        [UPDATING_USER_SUCCESS](state, users) {
            state.isLoading = false;
            state.error = null;
            state.users = users;
        },
        [UPDATING_USER_ERROR](state, error) {
            state.isLoading = false;
            state.error = error;
            state.users = [];
        },
        [DELETING_USER](state) {
            state.isLoading = true;
            state.error = null;
        },
        [DELETING_USER_SUCCESS](state, users) {
            state.isLoading = false;
            state.error = null;
            state.users = users;
        },
        [DELETING_USER_ERROR](state, error) {
            state.isLoading = false;
            state.error = error;
            state.users = [];
        },
        [FETCHING_USERS](state) {
            state.isLoading = true;
            state.error = null;
            state.users = [];
        },
        [FETCHING_USERS_SUCCESS](state, users) {
            state.isLoading = false;
            state.error = null;
            state.users = users;
        },
        [FETCHING_USERS_ERROR](state, error) {
            state.isLoading = false;
            state.error = error;
            state.users = [];
        }
    },
    actions: {
        async create({ commit }, data) {
            commit(CREATING_USER);
            try {
                let response = await UserAPI.create(data);
                commit(CREATING_USER_SUCCESS, response.data);
                return response.data;
            } catch (error) {
                commit(CREATING_USER_ERROR, error);

                if (error.response && error.response.data) {
                    return error.response.data
                }

                return null;
            }
        },
        async update({ commit }, data) {
            commit(UPDATING_USER);
            try {
                let response = await UserAPI.update(data);
                commit(UPDATING_USER_SUCCESS, response.data);
                return response.data;
            } catch (error) {
                commit(UPDATING_USER_ERROR, error);

                if (error.response && error.response.data) {
                    return error.response.data
                }

                return null;
            }
        },
        async delete({ commit }, id) {
            commit(DELETING_USER);
            try {
                await UserAPI.delete(id);
                let users = await UserAPI.findAll();
                commit(DELETING_USER_SUCCESS, users.data);
                return users.data;
            } catch (error) {
                commit(DELETING_USER_ERROR, error);

                if (error.response && error.response.data) {
                    return error.response.data
                }

                return null;
            }
        },
        async findAll({ commit }) {
            commit(FETCHING_USERS);
            try {
                let users = await UserAPI.findAll();
                commit(FETCHING_USERS_SUCCESS, users.data);
                return users.data;
            } catch (error) {
                commit(FETCHING_USERS_ERROR, error);

                if (error.response && error.response.data) {
                    return error.response.data
                }

                return null;
            }
        }
    }
};
