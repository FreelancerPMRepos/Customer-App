import { combineReducers } from "redux";
import auth from './AuthReducers'

export default combineReducers({
    auth: auth,
})