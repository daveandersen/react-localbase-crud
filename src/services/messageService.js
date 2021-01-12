import http from '../http-common';

export default {
    getAll : () => {
        return http.get("/messages")
    },
    get(id) {
        return http.get(`/messages/${id}`);
    },
    createData : data => {
        return http.post("/messages", data)
    },
    updateData(id, data) {
        return http.patch(`/messages/${id}`, data)
    }

} 

