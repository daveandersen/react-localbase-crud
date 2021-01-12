import http from '../http-common';

export default {
    getAll : () => {
        return http.get("/messages")
    },
    
    createData : data => {
        return http.post("/messages", data)
    }

} 

