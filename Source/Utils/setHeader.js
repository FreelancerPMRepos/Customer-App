import axios from 'axios'

export const setAuthToken = token => {
    axios.defaults.headers.common['Content-Type'] = 'application/json'
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}