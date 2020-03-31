import Vue from "vue";
import VueRouter from "vue-router";

import LoginUser from "../components/Security/LoginUser";

import Dashboard from "../components/Dashboard/Dashboard";

import User from "../components/User/User";
import Group from "../components/User/Group";
import Role from "../components/User/Role";

Vue.use(VueRouter);

export default new VueRouter({
    mode: "history",
    routes: [
        { path: "/login", name: "login", component: LoginUser },
        { path: "/", name: "home", component: Dashboard },
        { path: "/dashoard", name: "dashboard", component: Dashboard },
        // User Management
        { path: "/user-management/users", name: "users", component: User },
        { path: "/user-management/groups", name: "user-groups", component: Group },
        { path: "/user-management/roles", name: "user-roles", component: Role },
    ]
});
