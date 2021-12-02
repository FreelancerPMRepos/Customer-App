import { AUTH_SERVICE_RUNNING, AUTH_ERROR, SET_USER, SET_LOGIN_SUCCESS, RESET_AUTH } from './Types'
import axios from "axios";
import { BASE_URL } from '../Config';

export const login = (payload) => {
    return async (dispatch) => {
        dispatch({ type: AUTH_SERVICE_RUNNING })
        axios.post(`${BASE_URL}/login`, payload)

        .then(res => {
            console.log("res", res.data)
            if (res.data.error) {
                dispatch({ type: AUTH_ERROR, payload: {error: res.error}})
            } else {
                dispatch({ type: SET_USER, payload: { access_token: res.data.access_token}})
                dispatch({ type: SET_LOGIN_SUCCESS })
            }
        })
        .catch(e => {
            console.log("asd",e.message)
            alert(e.message)
            dispatch({ type: AUTH_ERROR, payload: { error: e}})
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
                dispatch({ type: AUTH_ERROR, payload: {error: res.error}})
                console.log("err", res.data)
            } else {
                dispatch({ type: SET_USER, payload: { access_token: res.data.access_token}})
                dispatch({ type: SET_LOGIN_SUCCESS })
            }
        })
        .catch(e => {
            console.log("payload",payload)
            alert("error",e)
            dispatch({ type: AUTH_ERROR, payload: { error: e}})
        })
    }
}

export const setUser = (user) => ({ type: SET_USER, payload: user })

export const setLoginSuccess = () => ({ type: SET_LOGIN_SUCCESS })

export const resetAuth = () => ({ type: RESET_AUTH})