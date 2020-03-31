import store from '../../vuex/store'
import router from "../../router"
import axios from "axios"

export default {
    automaticLogin() {
        // Set user data on page refresh
        const userString = localStorage.getItem("user")
        if (userString) {
            const userData = JSON.parse(userString);
            store.dispatch("auth/setUserData", userData)
        }
    },
    isLoggedIn() {
        const loggedIn =  store.getters['auth/isLoggedIn']

        if (loggedIn && router.currentRoute.name === "login") {
            router.push({name: "dashboard"})
        }
    },
    interceptUnAuthorized() {
        axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response.status === 401 && router.currentRoute.name !== 'login') {
                    store.dispatch("auth/logout")
                }
                return Promise.reject(error)
            }
        );
    }
}
