import axios from "axios";
import { jwtDecode } from 'jwt-decode';

axios.defaults.baseURL = 'http://localhost:8080'; //The backend url (springboot)
axios.defaults.headers.post["Content-Type"] = 'application/json'; //accepts/sends json data

//Method to receive the authorization token.
export const getAuthToken = () => {
    return window.localStorage.getItem("auth_token");
}

export const getUsername = ( token ) => {
		console.log(jwtDecode(token).iss)
    return jwtDecode(token).iss;
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
    const token = getAuthToken();
    if (token) {
        headers = {"Authorization": `Bearer ${token}`};
    }

    return axios({
        method: method,
        url: url,
        data: data,
        headers: headers
    });
}

//export default request;