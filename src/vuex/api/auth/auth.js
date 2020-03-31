import API from "../api";

export default {
    loginUrl: "api/login_check",
    login(data) {
        return API.http.post(API.host + this.loginUrl, data);
    }
};
