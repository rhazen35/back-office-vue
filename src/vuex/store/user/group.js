import GroupAPI from "../../api/user/group";

const CREATING_GROUP = "CREATING_GROUP",
    CREATING_GROUP_SUCCESS = "CREATING_GROUP_SUCCESS",
    CREATING_GROUP_ERROR = "CREATING_GROUP_ERROR",
    UPDATING_GROUP = "UPDATING_GROUP",
    UPDATING_GROUP_SUCCESS = "UPDATING_GROUP_SUCCESS",
    UPDATING_GROUP_ERROR = "UPDATING_GROUP_ERROR",
    DELETING_GROUP = "DELETING_GROUP",
    DELETING_GROUP_SUCCESS = "DELETING_GROUP_SUCCESS",
    DELETING_GROUP_ERROR = "DELETING_GROUP_ERROR",
    FETCHING_GROUPS = "FETCHING_GROUPS",
    FETCHING_GROUPS_SUCCESS = "FETCHING_GROUPS_SUCCESS",
    FETCHING_GROUPS_ERROR = "FETCHING_GROUPS_ERROR",
    PAGINATING_GROUPS = "PAGINATING_GROUPS",
    PAGINATING_GROUPS_SUCCESS = "PAGINATING_GROUPS_SUCCESS",
    PAGINATING_GROUPS_ERROR = "PAGINATING_GROUPS_ERROR";

export default {
    namespaced: true,
    state: {
        isLoading: false,
        error: null,
        groups: []
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
        hasGroups(state) {
            return state.groups["hydra:member"].length > 0;
        },
        groups(state) {
            return state.groups["hydra:member"];
        }
    },
    mutations: {
        [CREATING_GROUP](state) {
            state.isLoading = true;
            state.error = null;
        },
        [CREATING_GROUP_SUCCESS](state, group) {
            state.isLoading = false;
            state.error = null;
            state.groups["hydra:member"].unshift(group);
        },
        [CREATING_GROUP_ERROR](state, error) {
            state.isLoading = false;
            state.error = error;
            state.groups = [];
        },
        [UPDATING_GROUP](state) {
            state.isLoading = true;
            state.error = null;
        },
        [UPDATING_GROUP_SUCCESS](state, groups) {
            state.isLoading = false;
            state.error = null;
            state.groups = groups;
        },
        [UPDATING_GROUP_ERROR](state, error) {
            state.isLoading = false;
            state.error = error;
            state.groups = [];
        },
        [DELETING_GROUP](state) {
            state.isLoading = true;
            state.error = null;
        },
        [DELETING_GROUP_SUCCESS](state, groups) {
            state.isLoading = false;
            state.error = null;
            state.groups = groups;
        },
        [DELETING_GROUP_ERROR](state, error) {
            state.isLoading = false;
            state.error = error;
            state.groups = [];
        },
        [FETCHING_GROUPS](state) {
            state.isLoading = true;
            state.error = null;
            state.groups = [];
        },
        [FETCHING_GROUPS_SUCCESS](state, groups) {
            state.isLoading = false;
            state.error = null;
            state.groups = groups;
        },
        [FETCHING_GROUPS_ERROR](state, error) {
            state.isLoading = false;
            state.error = error;
            state.groups = [];
        },
        [PAGINATING_GROUPS](state) {
            state.isLoading = true;
            state.error = null;
            state.groups = [];
        },
        [PAGINATING_GROUPS_SUCCESS](state, roles) {
            state.isLoading = false;
            state.error = null;
            state.groups = roles;
        },
        [PAGINATING_GROUPS_ERROR](state, error) {
            state.isLoading = false;
            state.error = error;
            state.groups = [];
        }
    },
    actions: {
        async create({ commit }, data) {
            commit(CREATING_GROUP);
            try {
                let response = await GroupAPI.create(data);
                commit(CREATING_GROUP_SUCCESS, response.data);
                return response.data;
            } catch (error) {
                commit(CREATING_GROUP_ERROR, error);

                if (error.response && error.response.data) {
                    return error.response.data
                }

                return null;
            }
        },
        async update({ commit }, data) {
            commit(UPDATING_GROUP);
            try {
                let response = await GroupAPI.update(data);
                commit(UPDATING_GROUP_SUCCESS, response.data);
                return response.data;
            } catch (error) {
                commit(UPDATING_GROUP_ERROR, error);

                if (error.response && error.response.data) {
                    return error.response.data
                }

                return null;
            }
        },
        async delete({ commit }, id) {
            commit(DELETING_GROUP);
            try {
                await GroupAPI.delete(id);
                let groups = await GroupAPI.findAll();
                commit(DELETING_GROUP_SUCCESS, groups.data);
                return groups.data;
            } catch (error) {
                commit(DELETING_GROUP_ERROR, error);

                if (error.response && error.response.data) {
                    return error.response.data
                }

                return null;
            }
        },
        async findAll({ commit }) {
            commit(FETCHING_GROUPS);
            try {
                let groups = await GroupAPI.findAll();
                commit(FETCHING_GROUPS_SUCCESS, groups.data);
                return groups.data;
            } catch (error) {
                commit(FETCHING_GROUPS_ERROR, error);
                return null;
            }
        },
        async paginate({ commit }, data) {
            commit(PAGINATING_GROUPS);
            try {
                let groups = await GroupAPI.paginate(data);
                commit(PAGINATING_GROUPS_SUCCESS, groups.data);
                return groups.data;
            } catch (error) {
                commit(PAGINATING_GROUPS_ERROR, error);
                return null;
            }
        }
    }
};
