import API from "../api";

export default {
    url: "api/v1/user_management/groups",
    create(data) {
        return API.http.post(API.host + this.url, data);
    },
    update(data) {
        return API.http.put(API.host + this.url + "/" + data.id, data);
    },
    delete(id) {
        return API.http.delete(API.host + this.url + "/" + id);
    },
    findAll() {
        return API.http.get(API.host + this.url);
    },
    find(id) {
        return API.http.get(API.host + this.url + "/" + id);
    },
    paginate(data) {
        return API.http.get(API.host + this.url, {
            params: data
        })
    }
};
