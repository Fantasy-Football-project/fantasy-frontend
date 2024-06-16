import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080'; //The backend url (springboot)
axios.defaults.withCredentials = true; // This allows cookies to be included in cross-origin requests
axios.defaults.headers.post["Content-Type"] = 'application/json'; //accepts/sends json data

//Method to receive the authorization token.

export const request = (method, url, data) => {
    return axios({
        method: method,
        url: url,
        data: data,
    })
}