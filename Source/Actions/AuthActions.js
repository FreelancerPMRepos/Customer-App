import { AUTH_SERVICE_RUNNING, AUTH_ERROR, SET_USER, SET_LOGIN_SUCCESS, RESET_AUTH, SET_LOGIN_TYPE, RESET_LOGIN_TYPE, LOGIN_ERROR } from './Types'
import axios from "axios";
import { BASE_URL } from '../Config';


export const login = (payload) => {
    return async (dispatch) => {
        axios.post(`${BASE_URL}/login`, payload)

            .then(res => {
                if (res.data.error) {
                    dispatch({ type: AUTH_ERROR, payload: { error: res.error } })
                } else {
                    dispatch({ type: AUTH_SERVICE_RUNNING })
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
                                    dispatch({ type: SET_USER, payload: { access_token: res.data.access_token, type: 'USER' } })
                                    dispatch({ type: SET_LOGIN_SUCCESS })
                                } else if (data.role == 'EMPLOYEE') {
                                    dispatch({ type: SET_USER, payload: { access_token: res.data.access_token, type: 'EMPLOYEE' } })
                                    dispatch({ type: SET_LOGIN_SUCCESS })
                                } else {
                                    alert("You do not have access.")
                                    dispatch({ type: LOGIN_ERROR })
                                }
                            } else {
                                console.log("error", error)
                                dispatch({ type: AUTH_ERROR, payload: { error: res.error } })
                            }
                        })
                        .catch(error => {
                            console.log('error unit', error)
                            dispatch({ type: AUTH_ERROR, payload: { error: res.error } })
                            // alert(error)
                        })
                }
            })
            .catch(e => {
                console.log("er", e.response.data.message)
                dispatch({ type: RESET_AUTH, payload: { error: e.error } })
                alert(`${e.response.data.message}`)

            })
    }
}

export const socialLogin = (token) => {
    return async (dispatch) => {
        dispatch({ type: SET_USER, payload: { access_token: token, type: 'USER' } })
        dispatch({ type: SET_LOGIN_SUCCESS })
    }
}

export const SocialSignup = (payload) => {
    console.log("ASdf")
    return async (dispatch) => {
        axios.post(`${BASE_URL}/social/signup`, payload)
            .then(res => {
                if (res.data.error) {
                    dispatch({ type: AUTH_ERROR, payload: { error: res.error } })
                } else {
                    console.log("response",res.data)
                   // dispatch({ type: SET_LOGIN_TYPE })
                    dispatch({ type: SET_USER, payload: { access_token: res.data.access_token, type: 'USER' } })
                    dispatch({ type: SET_LOGIN_SUCCESS })
                }
            })
            .catch(e => {
                alert(`${e.message}.`)
                dispatch({ type: AUTH_ERROR, payload: { error: e } })
            })
    }
}

export const signUp = (payload) => {
    return async (dispatch) => {
        axios.post(`${BASE_URL}/signup/customer`, payload)

            .then(res => {
                if (res.data.error) {
                    dispatch({ type: AUTH_ERROR, payload: { error: res.error } })
                } else {
                    dispatch({ type: AUTH_SERVICE_RUNNING })
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
                                    dispatch({ type: SET_USER, payload: { access_token: res.data.access_token, type: 'USER' } })
                                    dispatch({ type: SET_LOGIN_SUCCESS })
                                } else {
                                    alert("You do not have access.")
                                }
                            } else {
                                console.log("error", error)
                            }
                        })
                        .catch(error => {
                            alert(error)
                        })
                }
            })
            .catch(e => {
                alert(`${e.response.data.message}.`)
                dispatch({ type: AUTH_ERROR, payload: { error: e } })
            })
    }
}

export const setUser = (user) => ({ type: SET_USER, payload: user })

export const setLoginSuccess = () => ({ type: SET_LOGIN_SUCCESS })

export const resetAuth = () => ({ type: RESET_AUTH })

export const loginType = () => ({ type: SET_LOGIN_TYPE })

export const resetLoginType = () => ({ type: RESET_LOGIN_TYPE })

export const loginError = () => ({ type: LOGIN_ERROR })