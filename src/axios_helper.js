import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080'; //The backend url (springboot)
axios.defaults.headers.post["Content-Type"] = 'application/json'; //accepts/sends json data

const request = (method, url, data) => {
    return axios({
        method: method,
        url: url,
        data: data
    })
}

export default request;