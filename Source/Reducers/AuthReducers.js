import { AUTH_SERVICE_RUNNING, RESET_AUTH, SET_LOGIN_SUCCESS, SET_USER, SET_LOGIN_TYPE, RESET_LOGIN_TYPE, LOGIN_ERROR } from "../Actions/Types"

const initialState = {
    isLoading: false,
    isError: false,
    error: null,
    token: null,
    loginType: false,
    userType: null,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTH_SERVICE_RUNNING:
            return {
                ...state,
                isLoading: true,
            }
        case SET_USER:
            return {
                ...state,
                isLoading: false,
                access_token: action.payload.access_token ?? null,
                error: null,
                userType: action.payload.type ?? null,
            }
        case SET_LOGIN_SUCCESS:
            return {
                ...state,
                loginSuccess: true
            }
        case SET_LOGIN_TYPE:
            return {
                ...state,
                loginType: true,
            }
        case LOGIN_ERROR:
            return {
                ...state,
                isLoading: false,
            }    
            case RESET_LOGIN_TYPE:
                return {
                    ...state,
                    loginType: false,
                    loginSuccess: false
                }
        case RESET_AUTH:
            return initialState
        default:
            return state
    }
}