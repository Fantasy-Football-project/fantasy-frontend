import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080'; //The backend url (springboot)
axios.defaults.headers.post["Content-Type"] = 'application/json'; //accepts/sends json data

//Method to receive the authorization token.
export const getAuthToken = () => {
    return window.localStorage.getItem("auth_token");
}

export const setAuthToken = ( token ) => {
    if (token !== null) {
        window.localStorage.setItem("auth_token", token);
    }
    else {
        window.localStorage.removeItem("auth_token")
    }
    
}

export const request = (method, url, data) => {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null"){
        headers = {"Authorization": `Bearer ${getAuthToken()}`};
    }

    return axios({
        method: method,
        url: url,
        data: data,
        headers: headers
    })
}

//export default request;