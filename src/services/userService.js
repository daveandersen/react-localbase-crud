import http from '../http-common';

export default {
    getAll : () => {
        return http.get("/users")
    },
    get(id) {
        return http.get(`/users/${id}`);
    },
    createData : data => {
        return http.post("/users", data)
    },
    updateData(id, data) {
        return http.patch(`/users/${id}`, data)
    },
    deleteData(id) {
        return http.delete(`/users/${id}`)
    },
    deleteAll(){
        return http.delete(`/users/`)
    }

} 

