import { AUTH_SERVICE_RUNNING, AUTH_ERROR, SET_USER, SET_LOGIN_SUCCESS, RESET_AUTH, SET_LOGIN_TYPE } from './Types'
import axios from "axios";
import { BASE_URL } from '../Config';


export const login = (payload) => {
    return async (dispatch) => {
        dispatch({ type: AUTH_SERVICE_RUNNING })
        axios.post(`${BASE_URL}/login`, payload)

            .then(res => {
                console.log("res", res.data)
                if (res.data.error) {
                    dispatch({ type: AUTH_ERROR, payload: { error: res.error } })
                } else {
                    fetch(`${BASE_URL}/users/me`, {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${res.data.access_token}`
                        },
                    })
                        .then(response => { return Promise.all([response.status, response.json()]) })
                        .then(resp => {
                            let statusCode = resp[0]
                            let data = resp[1]

                            if (statusCode == 200) {
                                if (data.role == 'USER') {
                                    dispatch({ type: SET_USER, payload: { access_token: res.data.access_token } })
                                    dispatch({ type: SET_LOGIN_SUCCESS })
                                } else {
                                    alert("You do not have access")
                                }
                            } else {
                                console.log("error", error)
                            }
                        })
                        .catch(error => {
                            console.log('error unit', error)
                            alert(error)
                        })
                }
            })
            .catch(e => {
                console.log("asd", e.message)
                alert(e.message)
                dispatch({ type: AUTH_ERROR, payload: { error: e } })
            })
    }
}

export const socialLogin = (payload) => {
    return async (dispatch) => {
        dispatch({ type: AUTH_SERVICE_RUNNING })
        axios.post(`${BASE_URL}/social/login`, payload)

        .then(res => {
            console.log("res", res.data)
            if (res.data.error) {
                dispatch({ type: AUTH_ERROR, payload: { error: res.error } })
            } else {
                if (res.data.user_status == '0') {
                    dispatch({ type: SET_LOGIN_TYPE})
                     dispatch({ type: SET_LOGIN_SUCCESS })
                } else {
                    dispatch({ type: SET_USER, payload: { access_token: res.data.access_token } })
                    dispatch({ type: SET_LOGIN_SUCCESS })
                }
            }
        })
        .catch(e => {
            console.log("asd", e.message)
            alert(e.message)
            dispatch({ type: AUTH_ERROR, payload: { error: e } })
        })
    }
}

export const signUp = (payload) => {
    return async (dispatch) => {
        dispatch({ type: AUTH_SERVICE_RUNNING })
        axios.post(`${BASE_URL}/signup/customer`, payload)

            .then(res => {
                console.log("Res", res.data)
                if (res.data.error) {
                    dispatch({ type: AUTH_ERROR, payload: { error: res.error } })
                    console.log("err", res.data)
                } else {
                    dispatch({ type: SET_USER, payload: { access_token: res.data.access_token } })
                    dispatch({ type: SET_LOGIN_SUCCESS })
                }
            })
            .catch(e => {
                console.log("payload", payload)
                alert("error", e)
                dispatch({ type: AUTH_ERROR, payload: { error: e } })
            })
    }
}

export const setUser = (user) => ({ type: SET_USER, payload: user })

export const setLoginSuccess = () => ({ type: SET_LOGIN_SUCCESS })

export const resetAuth = () => ({ type: RESET_AUTH })

export const loginType = () => ({ type: SET_LOGIN_TYPE })