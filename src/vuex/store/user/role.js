import RoleAPI from "../../api/user/role";

const CREATING_ROLE = "CREATING_ROLE",
    CREATING_ROLE_SUCCESS = "CREATING_ROLE_SUCCESS",
    CREATING_ROLE_ERROR = "CREATING_ROLE_ERROR",
    UPDATING_ROLE = "UPDATING_ROLE",
    UPDATING_ROLE_SUCCESS = "UPDATING_ROLE_SUCCESS",
    UPDATING_ROLE_ERROR = "UPDATING_ROLE_ERROR",
    DELETING_ROLE = "DELETING_ROLE",
    DELETING_ROLE_SUCCESS = "DELETING_ROLE_SUCCESS",
    DELETING_ROLE_ERROR = "DELETING_ROLE_ERROR",
    FETCHING_ROLES = "FETCHING_ROLES",
    FETCHING_ROLES_SUCCESS = "FETCHING_ROLES_SUCCESS",
    FETCHING_ROLES_ERROR = "FETCHING_ROLES_ERROR",
    PAGINATING_ROLES = "PAGINATING_ROLES",
    PAGINATING_ROLES_SUCCESS = "PAGINATING_ROLES_SUCCESS",
    PAGINATING_ROLES_ERROR = "PAGINATING_ROLES_ERROR";

export default {
    namespaced: true,
    state: {
        isLoading: false,
        error: null,
        roles: []
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
        hasRoles(state) {
            return state.roles["hydra:member"].length > 0;
        },
        roles(state) {
            return state.roles["hydra:member"];
        }
    },
    mutations: {
        [CREATING_ROLE](state) {
            state.isLoading = true;
            state.error = null;
        },
        [CREATING_ROLE_SUCCESS](state, role) {
            state.isLoading = false;
            state.error = null;
            state.roles["hydra:member"].unshift(role);
        },
        [CREATING_ROLE_ERROR](state, error) {
            state.isLoading = false;
            state.error = error;
            state.roles = [];
        },
        [UPDATING_ROLE](state) {
            state.isLoading = true;
            state.error = null;
        },
        [UPDATING_ROLE_SUCCESS](state, roles) {
            state.isLoading = false;
            state.error = null;
            state.roles = roles;
        },
        [UPDATING_ROLE_ERROR](state, error) {
            state.isLoading = false;
            state.error = error;
            state.roles = [];
        },
        [DELETING_ROLE](state) {
            state.isLoading = true;
            state.error = null;
        },
        [DELETING_ROLE_SUCCESS](state, roles) {
            state.isLoading = false;
            state.error = null;
            state.roles = roles;
        },
        [DELETING_ROLE_ERROR](state, error) {
            state.isLoading = false;
            state.error = error;
            state.roles = [];
        },
        [FETCHING_ROLES](state) {
            state.isLoading = true;
            state.error = null;
            state.roles = [];
        },
        [FETCHING_ROLES_SUCCESS](state, roles) {
            state.isLoading = false;
            state.error = null;
            state.roles = roles;
        },
        [FETCHING_ROLES_ERROR](state, error) {
            state.isLoading = false;
            state.error = error;
            state.roles = [];
        },
        [PAGINATING_ROLES](state) {
            state.isLoading = true;
            state.error = null;
            state.roles = [];
        },
        [PAGINATING_ROLES_SUCCESS](state, roles) {
            state.isLoading = false;
            state.error = null;
            state.roles = roles;
        },
        [PAGINATING_ROLES_ERROR](state, error) {
            state.isLoading = false;
            state.error = error;
            state.roles = [];
        }
    },
    actions: {
        async create({ commit }, data) {
            commit(CREATING_ROLE);
            try {
                let response = await RoleAPI.create(data)
                commit(CREATING_ROLE_SUCCESS, response.data);
                return response.data;
            } catch (error) {
                commit(CREATING_ROLE_ERROR, error);

                if (error.response && error.response.data) {
                    return error.response.data
                }

                return null;
            }
        },
        async update({ commit }, data) {
            commit(UPDATING_ROLE);
            try {
                let response = await RoleAPI.update(data);
                commit(UPDATING_ROLE_SUCCESS, response.data);
                return response.data;
            } catch (error) {
                commit(UPDATING_ROLE_ERROR, error);

                if (error.response && error.response.data) {
                    return error.response.data
                }

                return null;
            }
        },
        async delete({ commit }, id) {
            commit(DELETING_ROLE);
            try {
                await RoleAPI.delete(id);
                let roles = await RoleAPI.findAll();
                commit(DELETING_ROLE_SUCCESS, roles.data);
                return roles.data;
            } catch (error) {
                commit(DELETING_ROLE_ERROR, error);

                if (error.response && error.response.data) {
                    return error.response.data
                }

                return null;
            }
        },
        async findAll({ commit }) {
            commit(FETCHING_ROLES);
            try {
                let roles = await RoleAPI.findAll();
                commit(FETCHING_ROLES_SUCCESS, roles.data);
                return roles.data;
            } catch (error) {
                commit(FETCHING_ROLES_ERROR, error);
                return null;
            }
        },
        async paginate({ commit }, data) {
            commit(PAGINATING_ROLES);
            try {
                let roles = await RoleAPI.paginate(data);
                commit(PAGINATING_ROLES_SUCCESS, roles.data);
                return roles.data;
            } catch (error) {
                commit(PAGINATING_ROLES_ERROR, error);
                return null;
            }
        }
    }
};
