import Vue from 'vue'
import securityHelpers from '../security/helpers/authorization'

export default {
    install () {
        Vue.securityHelpers = securityHelpers
        Vue.prototype.$securityHelpers = securityHelpers
    }
}