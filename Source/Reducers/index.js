import { combineReducers } from "redux";
import auth from './AuthReducers'
import PickSalonReducers from "./PickSalonReducers";

export default combineReducers({
    auth: auth,
    fav: PickSalonReducers,
})